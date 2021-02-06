import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Giphy from "./components/Giphy";
import "./index.css"
import {
  DndProvider,
  useDrag,
  useDrop,
} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { rhythm, column, gutter, DarkGray, maxAppWidth } from './lib';
import { sofiLogo, reactLogo } from './images';
const mockResponse = require('./__tests__/mockGiphyApiResponse.json');

const AppPageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  max-width: ${maxAppWidth}px;
  margin-right: auto;
  margin-left: auto;

  // non-prod CSS guardrails
  ${() => {
    if (process.env.NODE_ENV !== 'production') {
      /* Accessibility: All imgs must have an alt attribute,
       * see https://webaim.org/techniques/alttext/
       */
      return `
      img:not([alt]) {
        border: 5px dashed #c00 !important;
      }
    `;
    } else {
      return ``;
    }
  }};
`;

const AppHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${DarkGray};
  max-height: ${rhythm(4)}px;

  .react-logo-animation {
    animation: App-logo-spin infinite 20s linear;
    height: ${rhythm(2)}px;
    pointer-events: none;
  }

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledGif = styled.div`
  margin: 5px;
  padding: 3px;
  border: 1px solid black;
  display: inline-block;
`;

const Page = styled.div`
  padding: ${rhythm(2)}px ${column + gutter}px ${rhythm(3)}px
    ${column - gutter}px;
  @media (max-width: 768px) {
    padding: ${rhythm(1)}px ${gutter}px;
  }
`;

const StyledDropzone = styled.section`
  border: 1px solid ${DarkGray};
  min-height: ${rhythm(10)}px;
`;

const DndTypes = {
  RESULT: 'result',
};

const DraggableGifObject = (props) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id: props.slug, type: DndTypes.RESULT},
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(`${item.name} dropped into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <StyledGif>
      <div ref={drag} key={props.id}>{props.slug}</div>
    </StyledGif>
  )
}

const Dropzone = () => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: DndTypes.RESULT,
    drop: (item, monitor) => {
      console.log('Dropzone received', item);
      return { name: 'Dropzone Area' }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <div ref={drop} >
      <StyledDropzone />
    </div>
  );
}

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppPageContainer>
        <AppHeader>
          <img src={sofiLogo} alt="SoFi logo" />
          <h1 style={{color: "#72bcd4"}}>Giphy</h1>
          <img
            src={reactLogo}
            className="react-logo-animation"
            alt="React logo"
          />
        </AppHeader>
        <div>
          <Giphy/>
        </div>
        <Page>
          <h2> Drag Into the Dropzone </h2>
          {_.map(mockResponse.data, (result) => (
            <DraggableGifObject key={result.id} {...result} />
          ))}
          <Dropzone />
        </Page>
      </AppPageContainer>
    </DndProvider>
  );
}

export default App;
