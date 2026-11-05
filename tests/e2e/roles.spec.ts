import { expect, test, type Page } from "@playwright/test";

const MENUS = {
  "Demo Employee": ["My Workspace"],
  "Demo HR": ["My Workspace", "HR", "Vendor Payments"],
  "Demo Finance": ["My Workspace", "Vendor Payments", "Finance"],
  "Demo Admin": ["My Workspace", "HR", "Vendor Payments", "Finance", "Admin"],
} as const;
type DemoName = keyof typeof MENUS;

async function signInAs(page: Page, name: DemoName) {
  await page.goto("/login");
  await page.getByRole("button", { name: new RegExp(name) }).click();
  await expect(page.getByTestId("role-badge")).toBeVisible();
}

test("signed-out visitors are sent to the login page", async ({ page }) => {
  await page.goto("/finance");
  await expect(page).toHaveURL(/\/login$/);
});

test("signed-out API calls get 401", async ({ request }) => {
  const res = await request.get("/api/admin/status");
  expect(res.status()).toBe(401);
});

for (const [name, menu] of Object.entries(MENUS) as [DemoName, readonly string[]][]) {
  test(`${name} sees only their modules`, async ({ page }) => {
    await signInAs(page, name);
    const nav = page.getByRole("navigation", { name: "Modules" });
    await expect(nav.getByRole("link")).toHaveText([...menu]);
  });
}

test("Employee is blocked from Admin pages and APIs", async ({ page }) => {
  await signInAs(page, "Demo Employee");
  const res = await page.goto("/admin");
  expect(res?.status()).toBe(404);
  const api = await page.request.get("/api/admin/status");
  expect(api.status()).toBe(403);
  const own = await page.request.get("/api/me/status");
  expect(own.status()).toBe(200);
});

test("Finance cannot open HR", async ({ page }) => {
  await signInAs(page, "Demo Finance");
  expect((await page.request.get("/api/hr/status")).status()).toBe(403);
  expect((await page.request.get("/api/finance/status")).status()).toBe(200);
});

test("Admin can open every module", async ({ page }) => {
  await signInAs(page, "Demo Admin");
  for (const path of ["/me", "/hr", "/vendor-payments", "/finance", "/admin"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
  }
});

test("sign out returns to login", async ({ page }) => {
  await signInAs(page, "Demo HR");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
