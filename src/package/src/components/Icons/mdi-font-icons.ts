import MFont from './material-font.json';

// Tạo một loại cho MdiFontIcons
const MdiFont = MFont as Array<{ name: string; [key: string]: any }>;

interface MdiFontIconsType {
  [key: string]: string; // Định nghĩa kiểu cho các tên font
}

class MdiFontIcons {
  private _self: any = MdiFontIcons;
  constructor() {
    this._self = this;
  }
  mdifontname(name: string): string {
    return `mdi mdi-${name}`;
  }

  webfont(): MdiFontIconsType {
    const newJsonData: MdiFontIconsType = {};
    MdiFont.forEach(({ name }) => {
      newJsonData[name] = this._self.mdifontname(name);
    });
    return newJsonData;
  }
}

const MdiWebfont = new MdiFontIcons().webfont();

export { MdiWebfont };
