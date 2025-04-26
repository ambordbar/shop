import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

class CheckoutFormPage {
  static async fillName(name: string) {
    const input = screen.getByTestId("name-input") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, name);
  }

  static async fillPhone(phone: string) {
    const input = screen.getByTestId("phone-input") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, phone);
  }

  static async fillAddress(address: string) {
    const input = screen.getByTestId("address-input") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, address);
  }

  static submit() {
    const form = screen.getByTestId("form");
    fireEvent.submit(form);
  }

  static nameError() {
    return screen.getByTestId("name-error");
  }

  static phoneError() {
    return screen.getByTestId("phone-error");
  }

  static addressError() {
    return screen.getByTestId("address-error");
  }

  static alertModal() {
    return screen.queryByTestId("alert-modal");
  }

  static alertMessage() {
    return screen.queryByTestId("alert-message");
  }
}

export default CheckoutFormPage;
