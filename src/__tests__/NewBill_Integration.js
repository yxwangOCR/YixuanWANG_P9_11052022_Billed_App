
import { screen} from "@testing-library/dom";
import mockStore from "../__mocks__/store";
import BillsUI from "../views/BillsUI.js";

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I add a newBill", () => {
    test("Then this new Bill should be same as mockstore update example", async () => {
      const getSpy = jest.spyOn(mockStore, "bills");
      const newBill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20,
      };
      const postBills = await mockStore.bills().update(newBill);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(postBills).toStrictEqual(newBill);
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
      //window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
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
      //window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
