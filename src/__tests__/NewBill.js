/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes";

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
