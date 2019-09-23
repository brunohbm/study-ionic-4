import { 
  add,
  options,
} from "ionicons/icons";
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,  
  IonList,
  IonItem,
  IonLabel,  
  IonFab,
  IonIcon,
  IonFabButton,  
  IonPopover,
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
} from '@ionic/react';
import React from 'react';

class About extends React.Component {

  state = {
    showModal: false,
    todos: [
      {
        name: 'Adicione a sua primeira tarefa',
        description: 'Vai logo VAGABUNDO',
      }
    ]
  }

  getList = () => {
    const { todos, showPopover } = this.state;
    
    return todos.map(todo => (
      <IonItem>
          <IonLabel>
            <h2>
              <b>
                {todo.name}
              </b>
            </h2>
            <h3>
              {todo.description}
            </h3>
          </IonLabel>
          <IonPopover
            isOpen={showPopover}
            onDidDismiss={this.fechaPopover}
          >
            <p>This is popover content</p>
          </IonPopover>
          <IonButton slot="end"  onClick={() => { this.abrePopover(todo); }}>
            <IonIcon icon={options} />
          </IonButton>
      </IonItem>  
    ))
  }

  fechaPopover = () => {
    this.setState({ showPopover: false });
  }

  abrePopover = todo => {
    this.setState({ showPopover: true, deleteTodo: todo });
  }

  fechaModal = () => {
    this.setState({ showModal: false });
  }

  abreModal = () => {
    this.setState({ showModal: true });
  }

  getModal = () => {
    const { showModal } = this.state;

    return (
      <IonModal isOpen={showModal}>
        <div>
          <IonItem>
            <IonLabel position="fixed">Nome</IonLabel>
            <IonInput placeholder="Nome da tarefa"/>
          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Descrição</IonLabel>
            <IonTextarea placeholder="Descrição da tarefa"/>
          </IonItem>
        </div>
        <IonButton onClick={this.fechaModal}>Save</IonButton>
      </IonModal>
    )
  }

  render() {    

    return (
    <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>To do list</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
            <IonList>
              {this.getList()}                     
            </IonList>        
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={this.abreModal}>
                    <IonIcon  icon={add} />
                </IonFabButton>         
            </IonFab>
            {this.getModal()}
        </IonContent>
      </IonPage>
    );
  }

}

export default About;
