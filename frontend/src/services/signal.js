import lodash from "lodash";

class SignalService {
  static signal ({ session, type, data }) {
    return new Promise(
      (resolve, reject) => {
        if (!session) {
          console.error("No session found for signalling");
          reject(new Error("No session found for signalling"));
        }

        const payload = lodash({ type, data }).omitBy(lodash.isNil).value();
        session.signal(
          payload,
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        )
      }
    )
  }
}

export default SignalService;
