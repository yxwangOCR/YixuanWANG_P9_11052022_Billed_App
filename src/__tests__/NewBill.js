/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
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

    test("Then I click on 'Envoyer' button, it should add a new bill", () => {});
  });
});
