/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import mockStore from "../__mocks__/store";
import router from "../app/Router";
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should change input file", () => {
      // Test for NewBill ： 18-42
      const onNavigate = (pathname) => {
        // Init onNavigate
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const html = NewBillUI();
      document.body.innerHTML = html;
      const mockStore = {
        bills: jest.fn(() => newBill.store),
        create: jest.fn(() => Promise.resolve({})),
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image.png"], "image.png", { type: "png" })],
        },
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("image.png");
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });

    test("Then it should submit file", () => {
      // Test for NewBill ： 43-62
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = NewBillUI();

      const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const submitBtn = screen.getByTestId("form-new-bill");
      submitBtn.addEventListener("submit", handleSubmit);
      fireEvent.submit(submitBtn);
      expect(handleSubmit).toHaveBeenCalled();
    });

    test("Then the second icon in vertical layout should be highlighted", () => {
      const newBillIcon = screen.getByTestId("layout-icon2");
      expect(newBillIcon).toHaveClass("active-icon");
    });

    test("Then I click on the 'Type de depense' dropdownlist, it should be open", () => {
      render(
        (option = [
          "Transports",
          "Restaurants",
          "Hôtel et logement",
          "Services en ligne",
          "IT et électronique",
          "Equipement et matériel",
          "Fournitures de bureau",
        ]),
        (selected = "Transports")
      );
      const typeDepense = screen.getByTestId("type-depense");
      it("should render", () => {
        expect(typeDepense).toBeInTheDocument();
      });
    });

    test("Then I click on calendar icon, it should display current date", () => {});

    test("Then I click on 'Nom de la depense', it should allow me to input a text value", () => {});

    test("Then I click on TVA input, it should allow me to input a number value or choose a value", () => {});

    test("Then I click on 'Choisir un fichier' button, it should open user's file explorer", () => {});

    test("Then I click on 'Envoyer' button, it should add a new bill", () => {
      // not work
      document.body.innerHTML = BillsUI({ data: bills });
      const newBills = new Bills({
        // instancier la class Bills
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });
      const handleClickSendBill = jest.fn(newBills.handleClickSendBill);
      const sendBillButton = screen.getByTestId("btn-send-bill");
      sendBillButton.addEventListener("submit", handleClickSendBill);
      fireEvent.submit(sendBillButton);
      expect(handleClickSendBill).toHaveBeenCalled();
    });
  });
});

// Test integration:
jest.mock("../app/store", () => mockStore);

beforeEach(() => {
  jest.spyOn(mockStore, "bills");
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
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
  window.onNavigate(ROUTES_PATH.NewBill);
});

describe("Given I am connected as an employee", () => {
  describe("When I add a new Bill", () => {
    test("Then a new Bill should be same as mockstore update", async () => {
      const getSpy = jest.spyOn(mockStore, "bills");
      const newBill = {
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      };
      const addBills = await mockStore.bills().update(newBill);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(addBills).toStrictEqual(newBill);
    });
    test("Then add a new bill and it fails with a 404 error message", async () => {
      document.body.innerHTML = BillsUI({ error: "Erreur 404" });
      mockStore.bills.mockImplementationOnce(() => {
        return {
          post: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      await new Promise(process.nextTick);
      const errorMessage = await screen.getByText(/Erreur 404/);
      expect(errorMessage).toBeTruthy();
    });

    test("Then add a new bill and it fails with 500 error message", async () => {
      document.body.innerHTML = BillsUI({ error: "Erreur 500" });
      mockStore.bills.mockImplementationOnce(() => {
        return {
          post: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });
      await new Promise(process.nextTick);
      const errorMessage = await screen.getByText(/Erreur 500/);
      expect(errorMessage).toBeTruthy();
    });
  });
});
