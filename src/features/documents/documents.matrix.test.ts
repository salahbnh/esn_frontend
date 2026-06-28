import { describe, expect, it } from "vitest";

import {
  allowedUploadTypes,
  canDeleteDoc,
  canDownloadFrom,
  canUploadTo,
} from "@/features/documents/documents.matrix";

describe("canUploadTo", () => {
  it("lets RH/DIRECTION upload to a consultant, contract, candidate", () => {
    expect(canUploadTo("RH", "CONSULTANT")).toBe(true);
    expect(canUploadTo("DIRECTION", "CONTRACT")).toBe(true);
    expect(canUploadTo("RH", "CANDIDATE")).toBe(true);
  });

  it("restricts mission/assignment uploads to MANAGER/DIRECTION", () => {
    expect(canUploadTo("MANAGER", "MISSION")).toBe(true);
    expect(canUploadTo("RH", "MISSION")).toBe(false);
    expect(canUploadTo("DIRECTION", "ASSIGNMENT")).toBe(true);
  });

  it("a CONSULTANT may upload only to their OWN consultant profile", () => {
    expect(canUploadTo("CONSULTANT", "CONSULTANT", true)).toBe(true);
    expect(canUploadTo("CONSULTANT", "CONSULTANT", false)).toBe(false);
    expect(canUploadTo("CONSULTANT", "CONTRACT", true)).toBe(false);
  });

  it("is false for no role", () => {
    expect(canUploadTo(null, "CONSULTANT")).toBe(false);
  });
});

describe("allowedUploadTypes", () => {
  it("limits a CONSULTANT to CV/OTHER", () => {
    expect(allowedUploadTypes("CONSULTANT")).toEqual(["CV", "OTHER"]);
  });

  it("offers all types to privileged roles", () => {
    expect(allowedUploadTypes("RH")).toContain("CONTRACT");
    expect(allowedUploadTypes("RH")).toContain("MISSION_DOC");
  });
});

describe("canDownloadFrom", () => {
  it("lets a CONSULTANT list consultant/contract/mission docs (ownership checked server-side)", () => {
    expect(canDownloadFrom("CONSULTANT", "CONSULTANT")).toBe(true);
    expect(canDownloadFrom("CONSULTANT", "CONTRACT")).toBe(true);
    expect(canDownloadFrom("CONSULTANT", "MISSION")).toBe(true);
  });

  it("never lets a CONSULTANT reach candidate/client/template docs", () => {
    expect(canDownloadFrom("CONSULTANT", "CANDIDATE")).toBe(false);
    expect(canDownloadFrom("CONSULTANT", "CLIENT")).toBe(false);
    expect(canDownloadFrom("CONSULTANT", "CONTRACT_TEMPLATE")).toBe(false);
  });
});

describe("canDeleteDoc", () => {
  it("is RH/DIRECTION only", () => {
    expect(canDeleteDoc("RH")).toBe(true);
    expect(canDeleteDoc("DIRECTION")).toBe(true);
    expect(canDeleteDoc("MANAGER")).toBe(false);
    expect(canDeleteDoc("CONSULTANT")).toBe(false);
    expect(canDeleteDoc(null)).toBe(false);
  });
});
