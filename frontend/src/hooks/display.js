// @flow
import React from "react";
import ConfigurationService from "services/configuration";

interface Display {
  raiseHand: boolean;
  participants: boolean;
  chat: boolean;
  questions: boolean;
  polling: boolean;
}

interface UseDisplayOptions {
  tenant: string;
}

function useDisplay ({ tenant }: UseDisplayOptions) {
  const [display, setDisplay] = React.useState<Display>({
    raiseHand: false,
    participants: false,
    chat: false,
    questions: false,
    polling: false
  });

  React.useEffect(
    () => {
      async function fetch () {
        const configuration = await ConfigurationService.retrieve({ tenant });
        setDisplay({
          raiseHand: configuration.participant.raiseHand ?? true,
          participants: configuration.tabs.participants,
          chat: configuration.tabs.chat,
          questions: configuration.tabs.questions,
          polling: configuration.tabs.polling
        })
      }
      fetch();
    },
    [tenant]
  );

  return { display }
}

export default useDisplay;
