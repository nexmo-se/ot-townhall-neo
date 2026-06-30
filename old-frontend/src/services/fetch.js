// @flow
class FetchService{
  static async fetch(url: string, options?: any): Promise<any> {
    const response = await fetch(url, options);
    if(response.ok){
      const jsonResponse = await response.json();
      return jsonResponse;
    }else {
      const jsonResponse = await response.json();
      throw new Error(jsonResponse.message);
    }
  }

  static async get(url: string, accessToken?: string): Promise<any> {
    const headers = JSON.parse(JSON.stringify({
      Accept: "application/json",
      Authorization: accessToken? `Bearer ${accessToken}`: undefined
    }));

    const options = { method: "GET", headers };
    return FetchService.fetch(url, options);
  }

  static async post(url: string, body?: string, accessToken?: string): Promise<any> {
    const headers =  JSON.parse(JSON.stringify({ 
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: accessToken? `Bearer ${accessToken}`: undefined
    }));

    const options = { method: "POST", headers, body }
    return FetchService.fetch(url, options);
  }

  static async delete(url: string, body?: string, accessToken?: string): Promise<void> {
    const headers =  JSON.parse(JSON.stringify({ 
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: accessToken? `Bearer ${accessToken}`: undefined
    }));

    const options = { method: "DELETE", headers, body }
    return FetchService.fetch(url, options);
  }

  static async put(url: string, body?: string, accessToken?: string): Promise<any> {
    const headers =  JSON.parse(JSON.stringify({ 
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: accessToken? `Bearer ${accessToken}`: undefined
    }));

    const options = { method: "PUT", headers, body }
    return FetchService.fetch(url, options);
  }
}
export default FetchService;