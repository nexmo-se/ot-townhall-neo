// @flow

interface IDownload {
  url: string;
  name?: string;
}

class DownloadService {
  static download({ url, name }: IDownload) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    if (name) link.download = name;

    document.body?.appendChild(link); // eslint-disable-line
    link.click();
    document.body?.removeChild(link); // eslint-disable-line
  }
}
export default DownloadService;