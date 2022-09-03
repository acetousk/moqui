import { ReviewGetters, AgnosticRateCount, AgnosticPagination } from '@vue-storefront/core';
import type { Review, ReviewItem } from '@vue-storefront/moqui-api';
import formatDate from 'src/helpers/formatDate';

export interface ReviewGettersExt<REVIEW, REVIEW_ITEM> extends ReviewGetters<REVIEW, REVIEW_ITEM> {
  [getterName: string]: (element: any, options?: any) => unknown;

}
function getItems(review: Review): ReviewItem[] {
  return review?.reviewItems || [];
}

function getReviewId(item: ReviewItem): string {
  return item?.productReviewId || '';
}

function getReviewAuthor(item: ReviewItem): string {
  return item?.postedByName || '';
}

function getReviewMessage(item: ReviewItem): string {
  return item?.productReview || '';
}

function getReviewRating(item: ReviewItem): number {
  return item?.productRating || 0;
}

function getReviewDate(item: ReviewItem): string {
  if (item?.postedTimestamp) {
    return formatDate(item.postedTimestamp);
  }
  return '';
}

function getTotalReviews(review: Review): number {
  return (review?.reviewListCount) || 0;
}

function getAverageRating(review: Review): number {
  return review?.productRating || 0;

}
function getPagination(review: Review): AgnosticPagination {
  return {
    currentPage: (review?.reviewListPageIndex || 0) + 1,
    totalPages: (review?.reviewListPageMaxIndex || 0) + 1,
    totalItems: (review?.reviewListCount || 0),
    itemsPerPage: (review?.reviewListPageSize || 0),
    pageOptions: [5]
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRatesCount(review: Review): AgnosticRateCount[] {
  return [];
}

function getReviewsPage(review: Review): number {
  return (review?.reviewListPageIndex || 0) + 1;
}

export const reviewGetters: ReviewGettersExt<Review, ReviewItem> = {
  getItems,
  getReviewId,
  getReviewAuthor,
  getReviewMessage,
  getReviewRating,
  getReviewDate,
  getTotalReviews,
  getAverageRating,
  getPagination,
  getRatesCount,
  getReviewsPage
};
