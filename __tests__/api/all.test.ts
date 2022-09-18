// import "@types/jest";
import { createMocks } from 'node-mocks-http';
import getByID from "../../pages/api/tags/[id]";

describe("tags", () => {
  describe("testing /api/tags", () => {
    describe("given /all route", () => {
      it("Should return all bookmarked", async () => {
       const {req, res} = createMocks({
        method : 'GET',
       })
       await getByID(req, res)

       expect(res._getStatusCode()).toBe(200)
      });
    });
  });
});
