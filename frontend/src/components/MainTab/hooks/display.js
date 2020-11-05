// @flow
import React from "react";
import ConfigurationService from "services/configuration";

interface IDisplay {
  participants: boolean;
  chat: boolean;
  questions: boolean;
  polling: boolean;
}

interface IArgs {
  tenant: string;
}

function useDisplay({ tenant }: IArgs){
  const [ display, setDisplay ] = React.useState<IDisplay>({
    participants: false,
    chat: false,
    questions: false,
    polling: false
  });

  React.useEffect(() => {
    async function fetch(){
      const configuration = await ConfigurationService.retrieve({ tenant });
      setDisplay(configuration.tabs);
    }
    fetch();
  }, [ tenant ]);

  return { display }
}
export default useDisplay;