/* global AP */
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form';

function App() {
  const [newItem, setNewItem] = useState('');
  const [toDos, setToDos] = useState(['Loading']); // ['Loading']); // [{text:'test', checked: false}]);
  const [loggedUser, setLoggedUser] = useState();
  const prettyToDos = JSON.stringify(toDos,null,2);

  // To do:
  // * tidy up
  

  useEffect(() => {
    // get user property
    async function call() {
      const currentLoggedUser = loggedUser ? loggedUser : await getLoggedInUser();
      // console.log({ loggedUser });
      const res = await AP.request({
        url: `/rest/api/3/user/properties/to-do?accountId=${currentLoggedUser}`,
        type: 'GET',
        // data: JSON.stringify(toDos),
        contentType: 'application/json',
      });
      const parsedRes = await JSON.parse(res.body);
      // alert(JSON.stringify(parsedRes.value));
      setToDos(parsedRes.value);
    } 
    call();    
  },[]);

  async function getLoggedInUser() {
    const res = await AP.request('/rest/api/3/myself');
    const user = JSON.parse(res.body);
    setLoggedUser(user.accountId);
    // console.log(user.accountId);
    return user.accountId;
  }

  const onCheck = (id) => {
    console.log(id);
    toDos[id].checked = !toDos[id].checked;
    setToDos(toDos);
  };

  const onRead = async () => {
    const res = await AP.request({
      url: `/rest/api/3/user/properties/to-do?accountId=${loggedUser}`,
      type: 'GET',
      // data: JSON.stringify(toDos),
      contentType: 'application/json',
    });
    const parsedRes = await JSON.parse(res.body);
    alert(JSON.stringify(parsedRes.value));
    // console.log(loggedUser);
  };

  const deleteAll = () => {
    const newToDos = [];
    setToDos(newToDos);
    setNewItem('');
    // set user property
    AP.request({
      url: `/rest/api/3/user/properties/to-do?accountId=${loggedUser}`,
      type: 'PUT',
      data: JSON.stringify(newToDos),
      contentType: 'application/json',
    });
  };

  const onSumbit = () => {
    const newToDos = [...toDos, {
      text: newItem,
      checked: false,
    }];
    setToDos(newToDos);
    setNewItem('');
    // set user property
    AP.request({
      url: `/rest/api/3/user/properties/to-do?accountId=${loggedUser}`,
      type: 'PUT',
      data: JSON.stringify(newToDos),
      contentType: 'application/json',
    });
  };

  // console.log(toDos);
  return (
    <div className="App">
      {toDos.map((toDo, index) =>
        <Checkbox
          key={index}
          value={index}
          label={toDo.text}
          onChange={(event) => { onCheck(event.currentTarget.value) }}
          name="checkbox-basic"
        />
      )}
      <Textfield
        name="new-item"
        value={newItem}
        onChange={(e) => {
          setNewItem(e.target.value);
        }}
      // onChange={(e) => {
      //   setNewTask(e.target.value);
      // }}
      />
      <Button
        type="submit"
        appearance="primary"
        onClick={onSumbit}
      >Save</Button>
      <Button
        type="submit"
        appearance="primary"
        onClick={() => {
          onRead();
        }}
      >Read</Button>
      <Button
        type="submit"
        appearance="primary"
        onClick={() => {
          deleteAll();
        }}
      >Delete All</Button>
      <div>
        ToDos: {" "} {prettyToDos}
      </div>
      <div>
        User: {" "} {loggedUser}
      </div>


      {/* {toDos.length > 0 && toDos.map((task) =>
        <Checkbox
          key={task}
          value={task}
          label={task}
          onChange={() => { }}
          name="checkbox-basic"
        />
      )}
      <Textfield
        name="newToDo"
        value={newTask}
        onChange={(e) => {
          setNewTask(e.target.value);
        }}
      />

      <Button
        onClick={() => {
          setToDos([...toDos, newTask]);
          setNewTask('');
          setNewTask('');
        }}
      >Save</Button>
      <div>{newTask}</div>
      <div>{toDos}</div> */}
    </div>
  );
}

export default App;
