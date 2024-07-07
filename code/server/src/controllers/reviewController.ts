import { User } from "../components/user";
import { ProductReview } from "../components/review";
import ReviewDAO from "../dao/reviewDAO";
import { ProductNotFoundError } from "../errors/productError";
/**
 * Represents a controller for managing product reviews.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ReviewController {
    private dao: ReviewDAO;

    constructor() {
        this.dao = new ReviewDAO();
    }

    /**
     * Adds a new review for a product.
     * @param model The model of the product to review.
     * @param user The username of the user who made the review.
     * @param score The score assigned to the product, in the range [1, 5].
     * @param comment The comment made by the user.
     * @param date The date the review was made.
     * @returns A Promise that resolves to nothing.
     */
    async addReview(model: string, user: User, score: number, comment: string, date: string): Promise<void> {
        await this.dao.addReview(model, user.username, score, date, comment);
    }

    /**
     * Returns all reviews for a product.
     * @param model The model of the product to get reviews from.
     * @returns A Promise that resolves to an array of ProductReview objects.
     */
    
    async getProductReviews(model: string): Promise<ProductReview[]> {
        const productExists = await this.dao.productExists(model);
        if (!productExists) {
            throw new ProductNotFoundError();
        }

        return await this.dao.getReviewsByProduct(model);
    }
    /**
     * Deletes the review made by a user for a product.
     * @param model The model of the product to delete the review from.
     * @param user The user who made the review to delete.
     * @returns A Promise that resolves to nothing.
     */
    async deleteReview(model: string, user: User): Promise<void> {
        await this.dao.deleteReview(model, user.username);
    }

    /**
     * Deletes all reviews for a product.
     * @param model The model of the product to delete the reviews from.
     * @returns A Promise that resolves to nothing.
     */
    async deleteReviewsOfProduct(model: string): Promise<void> {
        await this.dao.deleteAllReviewsOfProduct(model);
    }

    /**
     * Deletes all reviews of all products.
     * @returns A Promise that resolves to nothing.
     */
    async deleteAllReviews(): Promise<void> {
        await this.dao.deleteAllReviews();
    }
}

export default ReviewController;
