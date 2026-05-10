import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertContains,
  assertRoutes,
  routeSource,
  withTestServer,
} from "./setup.js";

describe("api-auth.js", () => {
  it("unit: declares the expected auth endpoints", () => {
    assertRoutes("api-auth.js", [
      "POST /register",
      "POST /verify-code", 
      "POST /login",
      "POST /logout",
    ]);
  });

  it("unit: validates registration structure", () => {
    const auth = routeSource("api-auth.js");

    assertContains(auth, "Email is required", "Register should require email");
    assertContains(auth, "UPI is required", "Register should require UPI");
    assertContains(auth, "Phone number is required", "Register should require phone");
    assertContains(auth, "Password must be at least 6 characters", "Register password length");
    
    
    assertContains(auth, "phoneRegex.test(phone)", "Register should validate phone number format");
    
    assertContains(
      auth,
      "Invalid phone number. Only numbers, dashes(-), and plus(+) are allowed.", 
      "Should show specific error for non-numeric phone numbers"
    );
  });

  it("integration: returns validation errors for invalid register data", async () => {
    await withTestServer(async ({ request }) => {
      const missingEmail = await request("/register", {
        method: "POST",
        body: JSON.stringify({ password: "secret1", upi: "abc123", phone: "0210000000" }),
      });
      assert.equal(missingEmail.status, 400);

      const invalidPhone = await request("/register", {
        method: "POST",
        body: JSON.stringify({
          email: "test@aucklanduni.ac.nz",
          password: "password123",
          upi: "test123",
          phone: "021-PHONE-123"
        }),
      });
      assert.equal(invalidPhone.status, 400);
      assert.strictEqual(
        invalidPhone.body.error, 
        "Invalid phone number. Only numbers, dashes(-), and plus(+) are allowed."
      );
    });
  });

  it("integration: rejects non-UoA registration emails", async () => {
    await withTestServer(async ({ request }) => {
      const response = await request("/register", {
        method: "POST",
        body: JSON.stringify({
          email: "person@gmail.com",
          password: "secret1",
          upi: "abc123",
          phone: "+64210000000",
        }),
      });

      assert.equal(response.status, 400);
      assert.match(response.body.error, /University of Auckland email address/);
    });
  });

  it("integration: verify-code fails with wrong code", async () => {
    await withTestServer(async ({ request }) => {
      const response = await request("/verify-code", {
        method: "POST",
        body: JSON.stringify({
          email: "student@aucklanduni.ac.nz",
          code: "000000" 
        }),
      });
      assert.equal(response.status, 400);
      assert.strictEqual(response.body.error, "Invalid code or email.");
    });
  });

  it("integration: validates login payload and clears logout cookie", async () => {
    await withTestServer(async ({ request }) => {
      const login = await request("/login", {
        method: "POST",
        body: JSON.stringify({ email: "student@aucklanduni.ac.nz" }),
      });
      assert.equal(login.status, 400); 

      const logout = await request("/logout", { method: "POST" });
      assert.equal(logout.status, 204);
      assert.match(
        logout.headers.get("set-cookie"),
        /authToken=;.*Expires=Thu, 01 Jan 1970/i
      );
    });
  });
});