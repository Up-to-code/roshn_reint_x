import { describe, expect, test } from "bun:test";

import { interestListHref } from "../../app/[locale]/(protected)/dashboard/interests/interest-query";

describe("Interest inbox query policy", () => {
  test("omits default filters and normalizes search input", () => {
    expect(interestListHref("/ar/dashboard/interests", "  ", "all")).toBe("/ar/dashboard/interests");
    expect(interestListHref("/en/dashboard/interests", "  villa  ", "unread", 2))
      .toBe("/en/dashboard/interests?search=villa&filter=unread&page=2");
  });
});
