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

    if (document.body) document.body.appendChild(link);
    link.click();
    if (document.body) document.body.removeChild(link);
  }
}
export default DownloadService;