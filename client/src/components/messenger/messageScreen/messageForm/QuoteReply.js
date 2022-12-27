import moment from "moment";
import { useDispatch } from "react-redux";
import { quoteMessage } from "../../../../actions/messenger";
import { memo } from "react";
import {
  QuoteBackIcon,
  QuoteContainer,
  QuoteTextContainer,
  QuoteText,
  CloseIcon,
  QuoteTime,
} from "./styles";

function QuoteReply({ quote }) {
  const dispatch = useDispatch();

  return (
    <QuoteContainer>
      <QuoteTextContainer>
        <QuoteBackIcon />
        <div>
          <QuoteTime>
            {quote.senderName.firstName} {quote.senderName.lastName}{" "}
            {moment(quote.time).format("LT, ddd MMM Do, YY")}
          </QuoteTime>
          <QuoteText>{quote.text}</QuoteText>
        </div>
      </QuoteTextContainer>
      <CloseIcon onClick={() => dispatch(quoteMessage(null))} />
    </QuoteContainer>
  );
}

export default memo(QuoteReply);
