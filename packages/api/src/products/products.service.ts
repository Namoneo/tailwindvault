import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    categoryId?: string;
    sort?: string;
  }) {
    const page = Number(query.page ?? 1);
    const limit = Math.min(Number(query.limit ?? 12), 50);
    const search = query.search?.trim().toLowerCase();
    const category = query.category ?? query.categoryId;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    switch (query.sort) {
      case 'price-asc':
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price-desc':
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'name-asc':
        queryBuilder.orderBy('product.name', 'ASC');
        break;
      default:
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products: products.map((product) => this.serializeProduct(product)),
      total,
      page,
      limit
    };
  }

  async findCategories() {
    const rows = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .orderBy('product.category', 'ASC')
      .getRawMany<{ category: string }>();

    return rows.map((row) => ({
      id: row.category,
      name: row.category
    }));
  }

  async findBySlug(slug: string) {
    const product = await this.productRepository.findOne({ where: { slug } });

    if (!product) {
      throw new NotFoundException(`Product "${slug}" was not found.`);
    }

    return this.serializeProduct(product);
  }

  async findByCategory(category: string) {
    const products = await this.productRepository.find({
      where: { category },
      order: { createdAt: 'DESC' }
    });

    return products.map((product) => this.serializeProduct(product));
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      ...createProductDto,
      featuresJson: JSON.stringify(createProductDto.features ?? [])
    });

    const savedProduct = await this.productRepository.save(product);
    return this.serializeProduct(savedProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product #${id} was not found.`);
    }

    Object.assign(product, {
      ...updateProductDto,
      featuresJson:
        updateProductDto.features !== undefined
          ? JSON.stringify(updateProductDto.features)
          : product.featuresJson
    });

    const savedProduct = await this.productRepository.save(product);
    return this.serializeProduct(savedProduct);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product #${id} was not found.`);
    }

    await this.productRepository.remove(product);
    return { deleted: true };
  }

  private serializeProduct(product: ProductEntity) {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      teamPrice: product.teamPrice,
      previewImageUrl: product.previewImageUrl,
      downloadUrl: product.downloadUrl,
      features: this.parseFeatures(product.featuresJson),
      createdAt: product.createdAt
    };
  }

  private parseFeatures(featuresJson: string): string[] {
    try {
      return JSON.parse(featuresJson) as string[];
    } catch {
      return [];
    }
  }
}
