/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills";
import VerticalLayout from "../views/VerticalLayout";
import mockStore from "../__mocks__/store";

const onNavigate = (pathname) => {
  // Init onNavigate
  document.body.innerHTML = ROUTES({ pathname });
};

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = VerticalLayout(120); // 120 is the height of the vertical layout?
      const pathname = ROUTES_PATH["Bills"];
      Object.defineProperty(window, "location", { value: { hash: pathname } });
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      const billIcon = screen.getByTestId("layout-icon1");
      expect(billIcon).toHaveClass("active-icon");
      expect(windowIcon).toHaveClass("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  describe("When I click the button to create a new bill", () => {
    // Test for Bills : 10-14
    test("Then it should redirect to the bill creation page", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const newBills = new Bills({
        // instancier la class Bills
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
      const handleClickNewBill = jest.fn(newBills.handleClickNewBill);
      const createBillButton = screen.getByTestId("btn-new-bill");
      createBillButton.addEventListener("click", handleClickNewBill);
      createBillButton.click();
      expect(handleClickNewBill).toHaveBeenCalled(); //toBeCalledWith(ROUTES_PATH.NewBill);?
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  });

  describe("When I click on the eye icon", () => {
    // Test for Bills : 15-18
    test("Then it should open the bill details", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const iconEye = screen.getByTestId("icon-eye"); //TestingLibraryElementError: Found multiple elements by: [data-testid="icon-eye"]
      const newBills = new Bills({
        // instancier la class Bills
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
      $.fn.modal = jest.fn(); //?
      const handleClickIconEye = jest.fn(newBills.handleClickIconEye);
      iconEye.forEach((icon) => {
        icon.addEventListener("click", handleClickIconEye(icon));
        icon.click();
      });
      expect(handleClickIconEye).toHaveBeenCalled();
      expect($.fn.modal).toHaveBeenCalled();
      expect(screen.getByText("Justificatif")).toBeTruthy();
    });
  });
});


// Test integration:
/*
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an Employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then fetch bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByText("Mes notes de frais"));
      const name1 = await screen.getByText("encore");
      expect(name1).toBeTruthy();
      const name2 = await screen.getByText("test1");
      expect(name2).toBeTruthy();
      const name3 = await screen.getByText("test3");
      expect(name3).toBeTruthy();
      const name4 = await screen.getByText("test2");
      expect(name4).toBeTruthy();
    });
    describe("When there is an error on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("Then add a new bill, if it fails with 404 error message", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("Then add a new bill, if it fails with 500 error message", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
*/