import { test, describe, expect, jest, beforeEach } from "@jest/globals";
import ProductController from "../../src/controllers/productController";
import ProductDAO from "../../src/dao/productDAO";
import { Product, Category } from "../../src/components/product";
import { ProductAlreadyExistsError, ValidationError } from "../../src/errors/productError";
import { DateError } from "../../src/utilities";

jest.mock("../../src/dao/productDAO");

describe("ProductController Tests", () => {
    let controller: ProductController;

    beforeEach(() => {
        controller = new ProductController();
    })

    //////With the following tests the productController.ts has already 100% coverage so no point in adding more tests////
    
    test("registerProducts should call addProduct of ProductDAO", async () => {
        jest.spyOn(ProductDAO.prototype, "addProduct").mockResolvedValueOnce();

        await controller.registerProducts("Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details");

        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledWith("Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details");
    })

    test("registerProducts should handle ProductAlreadyExistsError", async () => {
        jest.spyOn(ProductDAO.prototype, "addProduct").mockRejectedValueOnce(new ProductAlreadyExistsError());

        await expect(controller.registerProducts("Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details")).rejects.toThrow(ProductAlreadyExistsError);

        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledTimes(2);
        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledWith("Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details");
    })

    test("registerProducts should throw DateError for future arrival date", async () => {
        jest.spyOn(ProductDAO.prototype, "addProduct").mockImplementation(() => {
            throw new DateError();
        });

        await expect(controller.registerProducts("Model1", "Smartphone", "2025-01-01", 499.99, 10, "Details")).rejects.toThrow(DateError);

        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledTimes(3);
        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledWith("Model1", "Smartphone", "2025-01-01", 499.99, 10, "Details");
    })

    test("registerProducts should throw ValidationError for negative quantity", async () => {
        jest.spyOn(ProductDAO.prototype, "addProduct").mockImplementation(() => {
            throw new ValidationError("Quantity of the product must be greater than 0");
        });

        await expect(controller.registerProducts("Model1", "Smartphone", "2023-01-01", 499.99, -10, "Details")).rejects.toThrow(ValidationError);

        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledTimes(4);
        expect(ProductDAO.prototype.addProduct).toHaveBeenCalledWith("Model1", "Smartphone", "2023-01-01", 499.99, -10, "Details");
    })

    test("changeProductQuantity should call changeProductQuantity of ProductDAO", async () => {
        jest.spyOn(ProductDAO.prototype, "changeProductQuantity").mockResolvedValueOnce(10);

        const result = await controller.changeProductQuantity("Model1", 5, "2023-01-02");

        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.changeProductQuantity).toHaveBeenCalledWith("Model1", 5, "2023-01-02");
        expect(result).toBe(10);
    })

    test("sellProduct should call sellProduct of ProductDAO", async () => {
        jest.spyOn(ProductDAO.prototype, "sellProduct").mockResolvedValueOnce(5);

        const result = await controller.sellProduct("Model1", 2, "2023-01-03");

        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.sellProduct).toHaveBeenCalledWith("Model1", 2, "2023-01-03");
        expect(result).toBe(5);
    })

    test("getProducts should call getProducts of ProductDAO", async () => {
        const mockProducts: Product[] = [
            new Product(499.99, "Model1", Category.SMARTPHONE, "2023-01-01", "Details" , 10),
        ];
        jest.spyOn(ProductDAO.prototype, "getProducts").mockResolvedValueOnce(mockProducts);

        const result = await controller.getProducts(null, null, null);

        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getProducts).toHaveBeenCalledWith(null, null, null);
        expect(result).toEqual(mockProducts);
    })

    test("getAvailableProducts should call getAvailableProducts of ProductDAO", async () => {
        const mockProducts: Product[] = [
            new Product(499.99, "Model1", Category.SMARTPHONE, "2023-01-01", "Details" , 10),
        ];
        jest.spyOn(ProductDAO.prototype, "getAvailableProducts").mockResolvedValueOnce(mockProducts);

        const result = await controller.getAvailableProducts(null, null, null);

        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.getAvailableProducts).toHaveBeenCalledWith(null, null, null);
        expect(result).toEqual(mockProducts);
    })

    test("deleteAllProducts should call deleteAllProducts of ProductDAO", async () => {
        jest.spyOn(ProductDAO.prototype, "deleteAllProducts").mockResolvedValueOnce(true);

        const result = await controller.deleteAllProducts();

        expect(ProductDAO.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    })

    test("deleteProduct should call deleteProduct of ProductDAO", async () => {
        jest.spyOn(ProductDAO.prototype, "deleteProduct").mockResolvedValueOnce(true);

        const result = await controller.deleteProduct("Model1");

        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledTimes(1);
        expect(ProductDAO.prototype.deleteProduct).toHaveBeenCalledWith("Model1");
        expect(result).toBe(true);
    })


})
