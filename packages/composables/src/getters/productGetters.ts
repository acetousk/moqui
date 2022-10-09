import {
  AgnosticMediaGalleryItem,
  AgnosticAttribute,
  AgnosticPrice,
  ProductGetters,
  AgnosticBreadcrumb
} from '@vue-storefront/core';
import type { Product, ProductVariant, ProductFilter } from '@vue-storefront/moqui-api';
import { ProductPriceRange } from 'src/types';

function getId(product: Product): string {
  return product?.productId || '';
}

function getSlug(product: Product): string {
  return product?.productSlug || getId(product);
}

function getName(product: Product, productVariant?: ProductVariant): string {
  return productVariant?.productName || product?.productName || '';
}

function getDefaultVariantSlug(product: Product): string {
  return product?.defaultVariant?.slug || getSlug(product);
}

function getDefaultVarianId(product: Product): string {
  return product?.defaultVariant?.id || getId(product);
}

function getPrice(product: Product, productVariant?: ProductVariant): AgnosticPrice {
  const regularPrice = productVariant?.prices.listPrice || productVariant?.prices.price || product?.listPrice || product?.price || 0;
  const specialPrice = productVariant?.prices.price || productVariant?.prices.listPrice || product?.price || product?.listPrice || 0;
  return {
    regular: regularPrice,
    special: (regularPrice !== specialPrice) ? specialPrice : null
  };
}

function getPriceRange(product: Product): ProductPriceRange {
  if (!product?.hasVariants) {
    const price = getPrice(product);
    return {
      min: price.regular,
      max: price.regular,
      isDiscounted: price.special && (price.special < price.regular)
    };
  }
  return {
    min: product.minimalPrice,
    max: product.maximalPrice,
    isDiscounted: product.isDiscounted
  };
}

function getGallery(product: Product): AgnosticMediaGalleryItem[] {
  return product?.imageList?.map(image => {
    return {
      small: image.small,
      normal: image.medium,
      big: image.large
    };
  }) || [];
}

function getCoverImage(product: Product): string {
  if (product?.imageList?.length) {
    const coverImage = product.imageList.find(image => image.isCover === true);
    if (coverImage) return coverImage.small || '';
    else return product.imageList[0].small;
  }
  return '/product_placeholder.svg';
}

function getDescription(product: Product, productVariant?: ProductVariant): string {
  return productVariant?.descriptionLong || product?.descriptionLong || getShortDescription(product);
}

function getShortDescription(product: Product, productVariant?: ProductVariant): string {
  return productVariant?.descriptionSmall || product?.descriptionSmall || '';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCategoryIds(product: Product): string[] {
  return [];
}

function getBreadCrumbs(product: Product): AgnosticBreadcrumb[] {
  return product?.categoryPath?.map(categoryPath => {
    return {
      text: categoryPath.categoryName,
      link: categoryPath.categorySlug
    };
  }) || [];
}

function getFormattedPrice(price: number): string {
  return (price || 0).toFixed(2);
}

function getTotalReviews(product: Product): number {
  return product?.productReviewCount || 0;
}

function getAverageRating(product: Product): number {
  return product?.productRating || 0;
}

function getProductVariantFromUrlSlug(product: Product, variantSlug: string): ProductVariant | null {
  if (!product || !variantSlug) return null;
  return product?.variantOptions?.find(variant => variant.productSlug === variantSlug);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFiltered(products: Product[], filters: ProductFilter): Product[] {
  return products;
}

/*
* Filters product.variantOptions bases on feature query parameters
* These query parameters are used as an intermidiary state when a product variant
* does not exist for the combination selected, or one of the attributes is not selected yet.
*/
function getFilteredVariants(product: Product, params: Record<string, any>): Product {
  if (!params?.attributes)
    return product;

  return {
    ...product,
    variantOptions: {
      ...product?.variantOptions?.filter(variant => {
        let match = true;
        const attributeKeys = Object.keys(params.attributes);
        attributeKeys.forEach(key => {
          if (variant.features[key] !== params.attributes[key])
            match = false;
        });
        return match;
      })
    }
  };
}

function getAttributes(product: Product, filterByAttributeName: string[] = [], queryParams: Record<string, string> = {}): Record<string, AgnosticAttribute | string> {
  // If this is not a product with variants, we don't really have any attributes to worry about
  if (!product?.hasVariants || !product?.availableFeatures) return {};

  // Represents the attribute that is in the intermediary state, i.e does not relate to the current active product variant
  const sourceAttributeKeys = Object.keys(queryParams);
  const otherAttributeKeys = Object.keys(product.availableFeatures).filter(attr => !sourceAttributeKeys.includes(attr));

  // We return this object at the end
  const attributeObject = {};

  // Represents the available features for the current product.
  let availableAttributeKeys = Object.keys(product.availableFeatures);
  if (filterByAttributeName.length) availableAttributeKeys = availableAttributeKeys.filter(attr => filterByAttributeName.includes(attr));

  availableAttributeKeys.forEach(attr => {
    // If we have intermediary attributes (not relating to active variant), then we have to filter the other attribute options by the values of these intermediary attributes
    if (sourceAttributeKeys && otherAttributeKeys.includes(attr)) {
      // First filter the variant options by the current selection
      const filteredVariants = product.variantOptions.filter(variant => {
        let shouldInclude = true;
        sourceAttributeKeys.forEach(key => {
          if (variant.features[key] !== queryParams[key])
            shouldInclude = false;
        });
        return shouldInclude;
      });

      // Next, the construct options for other attributes (not yet selected)
      otherAttributeKeys.forEach(attr => {
        const possibleValues = [];

        filteredVariants.forEach(variant => {
          possibleValues.push(variant.features[attr]);
        });

        if (possibleValues.length) {
          attributeObject[attr] = product.availableFeatures[attr].options.filter(option => possibleValues.includes(option.id)).map(attrDetail => {
            return {
              name: attrDetail.label || '',
              value: attrDetail.id,
              label: attrDetail.label,
              attrName: product.availableFeatures[attr].label
            };
          });
        }
      });
    } else {
      // Otherwise, just show all available options.
      attributeObject[attr] = product.availableFeatures[attr].options.map(attrDetail => {
        return {
          name: attrDetail.label || '',
          value: attrDetail.id,
          label: attrDetail.label,
          attrName: product.availableFeatures[attr].label
        };
      });
    }
  });

  return attributeObject;
}

function getSelectedAttributes(product: Product, variantSlug: string, queryParams: Record<string, string>): Record<string, AgnosticAttribute | string> {

  const activeVariant = getProductVariantFromUrlSlug(product, variantSlug);
  if (!activeVariant) return {};

  // Retrieve the available attributes for the current product
  const attributes = getAttributes(product);
  const attributeKeys = Object.keys(attributes);

  // Retrieve the selected intermediary attibutes from the query params
  const paramKeys = Object.keys(queryParams);

  // We return the following object
  const selectedAttributes = {};
  attributeKeys.forEach((v) => {
    if (Object.keys(activeVariant.features).includes(v)) {
      // Query param value takes precedence over activeVariant value
      if (paramKeys.includes(v)) {
        selectedAttributes[v] = queryParams[v];
      } else {
        selectedAttributes[v] = activeVariant.features[v];
      }
    }
  });

  return selectedAttributes;
}

function getProductVariantFromFilters(product: Product, currentVariantSlug: string, sourceAttributes: Record<string, string>): string | null {

  const configuration = {
    ...getSelectedAttributes(product, currentVariantSlug, {}),
    ...sourceAttributes
  };

  const productVariant = product.variantOptions.find(variant => {
    const attributeKeys = Object.keys(configuration);
    let match = true;
    attributeKeys.forEach(key => {
      if (variant.features[key] !== configuration[key])
        match = false;
    });
    return match;
  });

  return productVariant?.productSlug || null;
}

function getStandardAttributes(product: Product): Array<Record<string, string>> {

  return product?.standardFeatureList?.map(standardFeature => {
    return {
      name: standardFeature.typeDescription,
      value: standardFeature.description
    };
  }) || [];
}

export const productGetters: ProductGetters<Product, ProductFilter> = {
  getName,
  getSlug,
  getDefaultVarianId,
  getDefaultVariantSlug,
  getProductVariantFromFilters,
  getPrice,
  getPriceRange,
  getGallery,
  getCoverImage,
  getFiltered,
  getFilteredVariants,
  getAttributes,
  getProductVariantFromUrlSlug,
  getSelectedAttributes,
  getDescription,
  getShortDescription,
  getCategoryIds,
  getId,
  getBreadCrumbs,
  getFormattedPrice,
  getTotalReviews,
  getAverageRating,
  getStandardAttributes
};
