// @flow

interface IDownload {
  url: string;
}

class DownloadService {
  static download({ url }: IDownload) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    document.body?.appendChild(link); // eslint-disable-line
    link.click();
    document.body?.removeChild(link); // eslint-disable-line
  }
}
export default DownloadService;