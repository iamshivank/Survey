import React, { useState } from "react";
import {
  Button,
  Flex,
  FormInput,
  Heading,
  Text
} from "@sparrowengg/twigs-react";
import { query } from "./helpers/query";
import { generateQuestion } from "./helpers/generateQuestions";
import { createSurvey } from "./helpers/createSurvey";
import { createQuestions } from "./helpers/createQuestions";
import {
  ChevronRightIcon
} from "@sparrowengg/twigs-react-icons";

const Main = ({ client }) => {
  const [text, setText] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  async function handleSubmit(e) {
    try {
      setIsDisabled(true);
      const response = await generateQuestion(query(text), client);
      const questionsArray = response?.choices[0]?.message?.content.split("\n");
      const creatSurveyRes = await createSurvey(text, client);

      const surveyObject = JSON.parse(creatSurveyRes).body;
      const surveyId = surveyObject?.data?.id;

      const len = questionsArray.length;
      await createQuestions(len, questionsArray, surveyId, client);
      document.getElementById("InputForChatGpt").value = "";
      client.interface.alertMessage("Survey Generated Successfully", {
        type: "success"
      });
    } catch (error) {
      document.getElementById("InputForChatGpt").value = "";
      client.interface.alertMessage(
        "Error while generating the survey. If your survey is malformed kindly delete it.",
        { type: "failure" }
      );
      console.log(error);
    } finally {
      setIsDisabled(false);
    }
  }
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      css={{
        height: "100vh"
      }}
    >
      <Heading
        css={{
          textTransform: "uppercase",
          textAlign: "center",
          color: "$black800",
          letterSpacing: "1.5px",
          marginBottom: "$8",
          borderBottom: "2px solid $black700"
        }}
        size="h4"
        weight="semibold"
      >
        Generate a survey using ChatGPT
      </Heading>
      <Text
        size="md"
        css={{
          marginBottom: "$6",
          maxWidth: 850,
          textAlign: "center",
          color: "$neutral800"
        }}
      >
        ChatGPT streamlines the process of crafting surveys by effortlessly
        generating questions that are both engaging and insightful, facilitating
        a more efficient survey creation experience.
      </Text>
      <Flex alignItems="flex-end" css={{ marginTop: "$10" }}>
        <FormInput
          css={{ width: 550 }}
          id={"InputForChatGpt"}
          size="xl"
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Enter information to generate..."
        />
        <Button
          size="xl"
          color="primary"
          disabled={isDisabled || !text}
          onClick={handleSubmit}
          rightIcon={<ChevronRightIcon />}
          css={{
            marginLeft: "$12"
          }}
        >
          Generate Survey
        </Button>
      </Flex>
    </Flex>
  );
};
export default Main;