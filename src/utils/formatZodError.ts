type FlattenedError = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

export function formatZodError(error: FlattenedError): string {
  const messages: string[] = [];

  for (const [field, errors] of Object.entries(error.fieldErrors)) {
    if (errors && errors.length > 0) {
      messages.push(`${field}: ${errors.join(", ")}`);
    }
  }

  if (error.formErrors.length > 0) {
    messages.push(`form: ${error.formErrors.join(", ")}`);
  }

  return messages.join("; ");
}
