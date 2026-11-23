import React, { useCallback } from "react";
import { FiList, FiPlus, FiTrash2 } from "react-icons/fi";

import { PlaceToSleepRoomRuleInput } from "../../types/PlaceToSleepRoom";

import {
  RulesContainer,
  Hint,
  RuleItem,
  RuleHeader,
  RuleTitle,
  RemoveRule,
  RuleFields,
  RuleInput,
  RuleSelect,
  AddRule,
  ErrorText,
} from "./styles";

interface PlaceToSleepRoomRulesProps {
  rules: PlaceToSleepRoomRuleInput[];
  onChange: (rules: PlaceToSleepRoomRuleInput[]) => void;
  error?: string;
}

const PlaceToSleepRoomRules: React.FC<PlaceToSleepRoomRulesProps> = ({
  rules,
  onChange,
  error,
}) => {
  const addRule = useCallback(() => {
    onChange([...rules, { text: "", isAllowed: true, icon: "" }]);
  }, [onChange, rules]);

  const removeRule = useCallback(
    (index: number) => {
      onChange(rules.filter((_, ruleIndex) => ruleIndex !== index));
    },
    [onChange, rules]
  );

  const updateRule = useCallback(
    (index: number, fields: Partial<PlaceToSleepRoomRuleInput>) => {
      onChange(
        rules.map((rule, ruleIndex) =>
          ruleIndex === index ? { ...rule, ...fields } : rule
        )
      );
    },
    [onChange, rules]
  );

  return (
    <RulesContainer>
      <Hint>
        Incluso aparece como permitido. Não permitido aparece como proibição.
        O ícone é opcional.
      </Hint>

      {rules.map((rule, index) => (
        <RuleItem key={`rule-${index}`}>
          <RuleHeader>
            <RuleTitle>
              <FiList size={20} />
              Regra {index + 1}
            </RuleTitle>
            <RemoveRule type="button" onClick={() => removeRule(index)}>
              <FiTrash2 size={16} />
              Remover
            </RemoveRule>
          </RuleHeader>

          <RuleFields>
            <RuleInput
              value={rule.text}
              placeholder="Texto da regra"
              onChange={(event) =>
                updateRule(index, { text: event.target.value })
              }
            />
            <RuleSelect
              value={rule.isAllowed ? "allowed" : "denied"}
              onChange={(event) =>
                updateRule(index, {
                  isAllowed: event.target.value === "allowed",
                })
              }
            >
              <option value="allowed">Incluso</option>
              <option value="denied">Não permitido</option>
            </RuleSelect>
          </RuleFields>

          <RuleInput
            value={rule.icon}
            placeholder="Ícone (opcional), ex.: smoke"
            onChange={(event) =>
              updateRule(index, { icon: event.target.value })
            }
          />
        </RuleItem>
      ))}

      <AddRule type="button" onClick={addRule}>
        <FiPlus size={16} />
        Adicionar regra
      </AddRule>

      {error && <ErrorText>{error}</ErrorText>}
    </RulesContainer>
  );
};

export default PlaceToSleepRoomRules;
