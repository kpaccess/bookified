"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024;

const voiceOptions = {
  male: [
    {
      value: "dave",
      name: "Dave",
      description: "Young male, British-Essex, casual & conversational",
    },
    {
      value: "daniel",
      name: "Daniel",
      description: "Middle-aged male, British, authoritative but warm",
    },
    {
      value: "chris",
      name: "Chris",
      description: "Male, casual & easy-going",
    },
  ],
  female: [
    {
      value: "rachel",
      name: "Rachel",
      description: "Young female, American, calm & clear",
    },
    {
      value: "sarah",
      name: "Sarah",
      description: "Young female, American, soft & approachable",
    },
  ],
} as const;

const uploadFormSchema = z.object({
  // Validate both MIME type and file extension to handle browser differences.
  pdfFile: z
    .instanceof(File, { message: "Please upload a PDF file." })
    .refine((file) => file.size <= MAX_PDF_SIZE_BYTES, {
      message: "PDF file must be 50MB or smaller.",
    })
    .refine(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
      {
        message: "Only PDF files are allowed.",
      },
    ),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) {
          return true;
        }

        return file.type.startsWith("image/");
      },
      {
        message: "Cover image must be a valid image file.",
      },
    ),
  title: z.string().trim().min(1, "Title is required."),
  authorName: z.string().trim().min(1, "Author name is required."),
  voice: z
    .string()
    .refine(
      (value) =>
        ["dave", "daniel", "chris", "rachel", "sarah"].includes(value),
      {
        message: "Please choose an assistant voice.",
      },
    ),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

const LoadingOverlay = () => {
  return (
    <div className="loading-wrapper" aria-live="polite" aria-busy="true">
      <div className="loading-shadow-wrapper bg-white">
        <div className="loading-shadow">
          <div className="loading-animation size-9 rounded-full border-4 border-[#f3e4c7] border-t-[#663820]" />
          <p className="loading-title">Creating your synthesis...</p>
          <p className="text-[#8B7355] text-sm">
            Please wait while we process your files.
          </p>
        </div>
      </div>
    </div>
  );
};

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hidden native file inputs are triggered from the styled dropzone containers.
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      authorName: "",
      voice: "rachel",
    },
  });

  const onSubmit = async (values: UploadFormValues) => {
    setIsSubmitting(true);

    try {
      // Placeholder async flow until backend upload/synthesis action is connected.
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Book upload form submitted", values);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch file fields so the dropzones can immediately switch to selected state.
  const selectedPdf = form.watch("pdfFile");
  const selectedCover = form.watch("coverImage");

  return (
    <div className="new-book-wrapper">
      {isSubmitting ? <LoadingOverlay /> : null}

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="pdfFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Book PDF File</FormLabel>
                <FormControl>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => pdfInputRef.current?.click()}
                    onKeyDown={(event) => {
                      // Mirror native button behavior for keyboard users.
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        pdfInputRef.current?.click();
                      }
                    }}
                    className={cn(
                      "upload-dropzone border-2 border-dashed border-[#d4c4a8]",
                      selectedPdf ? "upload-dropzone-uploaded" : "",
                    )}
                  >
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                      }}
                    />

                    {selectedPdf ? (
                      <div className="flex items-center gap-3 px-5">
                        <p className="upload-dropzone-text truncate max-w-[420px]">
                          {selectedPdf.name}
                        </p>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(event) => {
                            // Prevent re-opening the file picker when removing.
                            event.stopPropagation();
                            field.onChange(undefined);

                            if (pdfInputRef.current) {
                              pdfInputRef.current.value = "";
                            }
                          }}
                          aria-label="Remove PDF file"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="upload-dropzone-icon" />
                        <p className="upload-dropzone-text">
                          Click to upload PDF
                        </p>
                        <p className="upload-dropzone-hint">
                          PDF file (max 50MB)
                        </p>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">
                  Cover Image (Optional)
                </FormLabel>
                <FormControl>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => coverInputRef.current?.click()}
                    onKeyDown={(event) => {
                      // Mirror native button behavior for keyboard users.
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        coverInputRef.current?.click();
                      }
                    }}
                    className={cn(
                      "upload-dropzone border-2 border-dashed border-[#d4c4a8]",
                      selectedCover ? "upload-dropzone-uploaded" : "",
                    )}
                  >
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                      }}
                    />

                    {selectedCover ? (
                      <div className="flex items-center gap-3 px-5">
                        <p className="upload-dropzone-text truncate max-w-[420px]">
                          {selectedCover.name}
                        </p>
                        <button
                          type="button"
                          className="upload-dropzone-remove"
                          onClick={(event) => {
                            // Prevent re-opening the file picker when removing.
                            event.stopPropagation();
                            field.onChange(undefined);

                            if (coverInputRef.current) {
                              coverInputRef.current.value = "";
                            }
                          }}
                          aria-label="Remove cover image"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageUp className="upload-dropzone-icon" />
                        <p className="upload-dropzone-text">
                          Click to upload cover image
                        </p>
                        <p className="upload-dropzone-hint">
                          Leave empty to auto-generate from PDF
                        </p>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <input
                    className="form-input"
                    placeholder="ex: Rich Dad Poor Dad"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <input
                    className="form-input"
                    placeholder="ex: Robert Kiyosaki"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">
                  Choose Assistant Voice
                </FormLabel>
                <FormControl>
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <p className="text-sm text-[#777]">Male Voices</p>
                      <div className="voice-selector-options flex-col md:flex-row">
                        {voiceOptions.male.map((option) => {
                          const isSelected = field.value === option.value;

                          return (
                            <label
                              key={option.value}
                              className={cn(
                                "voice-selector-option items-start",
                                isSelected
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default",
                              )}
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => field.onChange(option.value)}
                                className="mt-1"
                              />
                              <div>
                                <p className="font-semibold text-[#212a3b]">
                                  {option.name}
                                </p>
                                <p className="text-sm text-[#5f6b7a] leading-5">
                                  {option.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-[#777]">Female Voices</p>
                      <div className="voice-selector-options flex-col md:flex-row">
                        {voiceOptions.female.map((option) => {
                          const isSelected = field.value === option.value;

                          return (
                            <label
                              key={option.value}
                              className={cn(
                                "voice-selector-option items-start",
                                isSelected
                                  ? "voice-selector-option-selected"
                                  : "voice-selector-option-default",
                              )}
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => field.onChange(option.value)}
                                className="mt-1"
                              />
                              <div>
                                <p className="font-semibold text-[#212a3b]">
                                  {option.name}
                                </p>
                                <p className="text-sm text-[#5f6b7a] leading-5">
                                  {option.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit" className="form-btn" disabled={isSubmitting}>
            Begin Synthesis
          </button>
        </form>
      </Form>
    </div>
  );
};
export default UploadForm;
