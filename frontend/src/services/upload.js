// @flow
import FetchService from "services/fetch";
import Axios from "axios"
import config from "config";

interface IUpload {
  tenant: string;
  formData?: FormData;
}

class UploadService {
  static async upload({ tenant, formData }: IUpload) {
    const url = `${config.apiURL}/upload/${tenant}`;
    const options = { method: "POST", body: formData }
    return FetchService.fetch(url, options);
  }
}
export default UploadService;