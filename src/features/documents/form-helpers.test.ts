import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api-client";
import { fr } from "@/lib/i18n/fr";
import {
  acceptFor,
  buildUploadFormData,
  documentErrorMessage,
  formatBytes,
  MAX_SIZE_BYTES,
  validateFile,
} from "@/features/documents/form-helpers";

describe("acceptFor", () => {
  it("limits CONTRACT to PDF and CV to doc/docx/pdf", () => {
    expect(acceptFor("CONTRACT")).toBe(".pdf");
    expect(acceptFor("CV")).toBe(".pdf,.doc,.docx");
    expect(acceptFor("MISSION_DOC")).toContain(".xlsx");
  });
});

describe("validateFile", () => {
  const pdf = new File(["x"], "c.pdf", { type: "application/pdf" });

  it("accepts an allowed mime", () => {
    expect(validateFile("CONTRACT", pdf)).toBeNull();
  });

  it("flags a missing file", () => {
    expect(validateFile("CV", null)).toBe("NO_FILE");
  });

  it("flags a disallowed mime", () => {
    const png = new File(["x"], "a.png", { type: "image/png" });
    expect(validateFile("CONTRACT", png)).toBe("BAD_MIME");
  });

  it("flags an oversized file", () => {
    const big = new File([new Uint8Array(MAX_SIZE_BYTES + 1)], "big.pdf", {
      type: "application/pdf",
    });
    expect(validateFile("CONTRACT", big)).toBe("FILE_TOO_LARGE");
  });

  it("defers an empty-mime file to the server", () => {
    const noMime = new File(["x"], "legacy.doc", { type: "" });
    expect(validateFile("CV", noMime)).toBeNull();
  });
});

describe("buildUploadFormData", () => {
  it("packs the file + meta fields", () => {
    const file = new File(["x"], "cv.pdf", { type: "application/pdf" });
    const form = buildUploadFormData({
      file,
      type: "CV",
      entityType: "CONSULTANT",
      entityId: "c1",
    });
    expect(form.get("type")).toBe("CV");
    expect(form.get("entityType")).toBe("CONSULTANT");
    expect(form.get("entityId")).toBe("c1");
    expect(form.get("file")).toBeInstanceOf(File);
  });
});

describe("formatBytes", () => {
  it("renders o / Ko / Mo", () => {
    expect(formatBytes(512)).toBe("512 o");
    expect(formatBytes(2048)).toBe("2 Ko");
    expect(formatBytes(3 * 1024 * 1024)).toBe("3.0 Mo");
  });
});

describe("documentErrorMessage (always French)", () => {
  it("maps the server codes", () => {
    expect(
      documentErrorMessage(new ApiError(400, "BAD_REQUEST", "x", { code: "BAD_MIME" })),
    ).toBe(fr.documents.errBadMime);
    expect(
      documentErrorMessage(new ApiError(413, "FILE_TOO_LARGE", "x", { code: "FILE_TOO_LARGE" })),
    ).toBe(fr.documents.errTooLarge);
  });

  it("accepts a bare local guard code string", () => {
    expect(documentErrorMessage("FILE_TOO_LARGE")).toBe(fr.documents.errTooLarge);
    expect(documentErrorMessage("NO_FILE")).toBe(fr.documents.errNoFile);
  });

  it("falls back to the generic French message", () => {
    expect(documentErrorMessage(new Error("net"))).toBe(fr.documents.saveError);
  });
});
