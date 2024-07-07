import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import ReviewController from "../../src/controllers/reviewController";
import ReviewDAO from "../../src/dao/reviewDAO";
import { User, Role } from "../../src/components/user";
import { ProductReview } from "../../src/components/review";
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { ProductNotFoundError, ValidationError } from "../../src/errors/productError";

jest.mock("../../src/dao/reviewDAO");

describe("ReviewController Tests", () => {
    let controller: ReviewController;
    let user: User;

    beforeEach(() => {
        controller = new ReviewController();
        user = { username: "testUser", name: "John", surname: "Doe", role: Role.CUSTOMER, address: "123 Main St", birthdate: "1990-01-01" };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Resetta tutti i mock dopo ogni test
    });

    test("addReview should call addReview of ReviewDAO", async () => {
        jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce();

        await controller.addReview("Model1", user, 5, "Great product!", "2024-05-30");

        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith("Model1", "testUser", 5, "2024-05-30", "Great product!");
    });

    test("addReview should handle ExistingReviewError", async () => {
        jest.spyOn(ReviewDAO.prototype, "addReview").mockRejectedValueOnce(new ExistingReviewError());

        await expect(controller.addReview("Model1", user, 5, "Great product!", "2024-05-30")).rejects.toThrow(ExistingReviewError);

        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith("Model1", "testUser", 5, "2024-05-30", "Great product!");
    });

    test("getProductReviews should call getReviewsByProduct of ReviewDAO", async () => {
        const reviews = [
            new ProductReview("Model1", "testUser", 5, "2024-05-30", "Great product!"),
        ];
        jest.spyOn(ReviewDAO.prototype, "getReviewsByProduct").mockResolvedValueOnce(reviews);

        const result = await controller.getProductReviews("Model1");

        expect(ReviewDAO.prototype.getReviewsByProduct).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.getReviewsByProduct).toHaveBeenCalledWith("Model1");
        expect(result).toEqual(reviews);
    });

    test("deleteReview should call deleteReview of ReviewDAO", async () => {
        jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValueOnce(true);

        await controller.deleteReview("Model1", user);

        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledWith("Model1", "testUser");
    });

    test("deleteReview should handle NoReviewProductError", async () => {
        jest.spyOn(ReviewDAO.prototype, "deleteReview").mockRejectedValueOnce(new NoReviewProductError());

        await expect(controller.deleteReview("Model1", user)).rejects.toThrow(NoReviewProductError);

        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledWith("Model1", "testUser");
    });

    test("deleteReviewsOfProduct should call deleteAllReviewsOfProduct of ReviewDAO", async () => {
        jest.spyOn(ReviewDAO.prototype, "deleteAllReviewsOfProduct").mockResolvedValueOnce(true);

        await controller.deleteReviewsOfProduct("Model1");

        expect(ReviewDAO.prototype.deleteAllReviewsOfProduct).toHaveBeenCalledTimes(1);
        expect(ReviewDAO.prototype.deleteAllReviewsOfProduct).toHaveBeenCalledWith("Model1");
    });

    test("deleteAllReviews should call deleteAllReviews of ReviewDAO", async () => {
        jest.spyOn(ReviewDAO.prototype, "deleteAllReviews").mockResolvedValueOnce(true);

        await controller.deleteAllReviews();

        expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
    });
});
