import { test, describe, expect, jest, beforeEach } from "@jest/globals";
import CartController from "../../src/controllers/cartController";
import CartDAO from "../../src/dao/cartDAO";
import { User } from "../../src/components/user";
import { Cart } from "../../src/components/cart";
import { CartNotFoundError, ProductNotInCartError } from "../../src/errors/cartError";
import { Role } from "../../src/components/user";

jest.mock("../../src/dao/cartDAO");

describe("CartController Tests", () => {
    let controller: CartController;
    let mockUser: User;

    beforeEach(() => {
        controller = new CartController();
        mockUser = { username: "testuser", name: "Test", surname: "User", role: Role.CUSTOMER, address: "", birthdate: "" };
    });

    test("addToCart should call addProductToCart of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "addProductToCart").mockResolvedValueOnce();

        await controller.addToCart(mockUser, "productModel");

        expect(CartDAO.prototype.addProductToCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.addProductToCart).toHaveBeenCalledWith(mockUser.username, "productModel");
    });

    test("addToCart should throw ProductNotFoundError if product not found", async () => {
        jest.spyOn(CartDAO.prototype, "addProductToCart").mockRejectedValueOnce(new CartNotFoundError());

        await expect(controller.addToCart(mockUser, "nonexistentProductModel")).rejects.toThrow(CartNotFoundError);

        expect(CartDAO.prototype.addProductToCart).toHaveBeenCalledTimes(2);
        expect(CartDAO.prototype.addProductToCart).toHaveBeenCalledWith(mockUser.username, "nonexistentProductModel");
    });

    test("getCart should call getCurrentCart of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "getCurrentCart").mockResolvedValueOnce({ customer: mockUser.username, paid: false, paymentDate: "", total: 0, products: [] });

        const result = await controller.getCart(mockUser);

        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getCurrentCart).toHaveBeenCalledWith(mockUser.username);
        expect(result).toEqual({ customer: mockUser.username, paid: false, paymentDate: "", total: 0, products: [] });
    });

    test("checkoutCart should call checkoutCart of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce();

        await controller.checkoutCart(mockUser);

        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalledWith(mockUser.username);
    });

    test("getCustomerCarts should call getPaidCarts of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "getPaidCarts").mockResolvedValueOnce([{ customer: mockUser.username, paid: true, paymentDate: "2024-06-11", total: 100, products: [] }]);

        const result = await controller.getCustomerCarts(mockUser);

        expect(CartDAO.prototype.getPaidCarts).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.getPaidCarts).toHaveBeenCalledWith(mockUser.username);
        expect(result).toEqual([{ customer: mockUser.username, paid: true, paymentDate: "2024-06-11", total: 100, products: [] }]);
    });

    test("removeProductFromCart should call removeProductFromCart of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce();

        await controller.removeProductFromCart(mockUser, "productModel");

        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(mockUser.username, "productModel");
    });

    test("removeProductFromCart should throw ProductNotInCartError if product not in cart", async () => {
        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotInCartError());

        await expect(controller.removeProductFromCart(mockUser, "nonexistentProductModel")).rejects.toThrow(ProductNotInCartError);

        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledTimes(2);
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalledWith(mockUser.username, "nonexistentProductModel");
    });

    test("clearCart should call emptyCart of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "emptyCart").mockResolvedValueOnce();

        await controller.clearCart(mockUser);

        expect(CartDAO.prototype.emptyCart).toHaveBeenCalledTimes(1);
        expect(CartDAO.prototype.emptyCart).toHaveBeenCalledWith(mockUser.username);
    });

    test("deleteAllCarts should call deleteAllCarts of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce();

        await controller.deleteAllCarts();

        expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalledTimes(1);
    });

    test("getAllCarts should call getAllCarts of CartDAO", async () => {
        jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce([{ customer: mockUser.username, paid: true, paymentDate: "2024-06-11", total: 100, products: [] }]);

        const result = await controller.getAllCarts();

        expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1);
        expect(result).toEqual([{ customer: mockUser.username, paid: true, paymentDate: "2024-06-11", total: 100, products: [] }]);
    });

});
