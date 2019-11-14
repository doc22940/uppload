import { UpploadService } from "../service";
import { HandlersParams } from "../helpers/interfaces";
import { translate } from "../helpers/i18n";
import { safeListen } from "../helpers/elements";
import { Uppload } from "../uppload";

export default class Local extends UpploadService {
  name = "local";
  icon = `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="nonzero"><path d="M177 56L125 4l-3-2v57h57c0-2-1-3-2-3z"/><path d="M173 113h8V75h-66c-5 0-8-4-8-8V1H27c-4 0-8 4-8 8v184c0 4 4 8 8 8h65v-8c0-45 36-80 81-80z"/><path d="M173 128c-36 0-65 29-65 64s29 64 65 64c35 0 64-29 64-64s-29-64-64-64zm27 63h-14v33c0 2-2 3-4 3h-20c-2 0-3-1-3-3v-33h-14c-3 0-5-3-3-5l28-30c1-2 3-2 5 0l27 30c2 2 1 5-2 5z"/></g></svg>`;
  color = "#34495e";
  mimeTypes = ["image/gif", "image/jpeg", "image/jpg", "image/png"];

  constructor(mimeTypes?: string[]) {
    super();
    if (mimeTypes) this.mimeTypes = mimeTypes;
  }

  template = (uppload: Uppload) => {
    return `<div class="drop-area">
      <div>${translate("services.local.drop")}</div>
      <em>${translate("services.local.or")}</em>
      <button class="uppload-button uppload-button--cta" style="background: ${
        this.color
      }">${translate("services.local.button")}</button>
    </div>
      <div class="alternate-input">
        <input type="file" accept="${this.mimeTypes.join()}">
      </div>`;
  };

  handlers = ({ next }: HandlersParams) => {
    const dropArea = document.querySelector(".drop-area");
    if (dropArea)
      safeListen(dropArea, "drop", event =>
        this.dropHandler(event as DragEvent, next)
      );
    if (dropArea) safeListen(dropArea, "dragover", this.dragHandler);
    if (dropArea) safeListen(dropArea, "dragend", this.dragStop);
    if (dropArea) safeListen(dropArea, "dragexit", this.dragStop);
    if (dropArea) safeListen(dropArea, "dragleave", this.dragStop);
    if (dropArea) safeListen(dropArea, "click", this.fileSelect);
    const input = document.querySelector(
      ".alternate-input input[type=file]"
    ) as HTMLInputElement | null;
    if (input) safeListen(input, "change", event => this.getFile(event, next));
  };

  getFile(event: Event, next: (file: Blob) => void) {
    const files = (event.target as HTMLInputElement).files;
    let file: File | null = null; // getAsFile() returns File | null
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        if (this.mimeTypes.includes(item.type)) file = item;
      }
    }
    if (!file) return;
    if (file) next(file);
    event.preventDefault();
  }

  fileSelect() {
    const input = document.querySelector(
      ".alternate-input input[type=file]"
    ) as HTMLInputElement | null;
    if (input) input.click();
  }

  private dragStop() {
    const dropArea = document.querySelector(".drop-area");
    if (dropArea) dropArea.classList.remove("drop-area-active");
  }

  dragHandler(event: Event) {
    event.preventDefault();
    const dropArea = document.querySelector(".drop-area");
    if (dropArea) dropArea.classList.add("drop-area-active");
  }

  dropHandler(event: DragEvent, next: (file: Blob) => void) {
    this.dragStop();
    let file: File | null = null; // getAsFile() returns File | null
    if (event.dataTransfer && event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const item = event.dataTransfer.items[i];
        if (item.kind === "file" && this.mimeTypes.includes(item.type))
          file = item.getAsFile();
      }
    }
    if (!file) return;
    if (file) next(file);
    event.preventDefault();
  }
}
