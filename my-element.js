import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
  static get styles() {
    return css`
      #main {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
        padding: 20px;
        margin: 24px;
        font-family: Arial, Helvetica, sans-serif;
      }

      .states-list,
      .circuits-list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
      }
    `;
  }

  static get properties() {
    return {
      data: { type: Object },
      uniqueCircuits: { type: Array },
      selectedCircuits: { type: Array },
      selectedStates: { type: Array },
    };
  }

  constructor() {
    super();
    this.data = {
      states: [
        { name: 'Alabama', circuit: '11th' },
        { name: 'Alaska', circuit: '9th' },
        { name: 'Arizona', circuit: '9th' },
        { name: 'Arkansas', circuit: '8th' },
        { name: 'California', circuit: '9th' },
        { name: 'Colorado', circuit: '10th' },
        { name: 'Connecticut', circuit: '2nd' },
        { name: 'Delaware', circuit: '3rd' },
        { name: 'Florida', circuit: '11th' },
        { name: 'Georgia', circuit: '11th' },
        { name: 'Hawaii', circuit: '9th' },
        { name: 'Idaho', circuit: '9th' },
        { name: 'Illinois', circuit: '7th' },
        { name: 'Indiana', circuit: '7th' },
        { name: 'Iowa', circuit: '8th' },
        { name: 'Kansas', circuit: '10th' },
        { name: 'Kentucky', circuit: '6th' },
        { name: 'Louisiana', circuit: '5th' },
        { name: 'Maine', circuit: '1st' },
        { name: 'Maryland', circuit: '4th' },
        { name: 'Massachusetts', circuit: '1st' },
        { name: 'Michigan', circuit: '6th' },
        { name: 'Minnesota', circuit: '8th' },
        { name: 'Mississippi', circuit: '5th' },
        { name: 'Missouri', circuit: '8th' },
        { name: 'Montana', circuit: '9th' },
        { name: 'Nebraska', circuit: '8th' },
        { name: 'Nevada', circuit: '9th' },
        { name: 'New Hampshire', circuit: '1st' },
        { name: 'New Jersey', circuit: '3rd' },
        { name: 'New Mexico', circuit: '10th' },
        { name: 'New York', circuit: '2nd' },
        { name: 'North Carolina', circuit: '4th' },
        { name: 'North Dakota', circuit: '8th' },
        { name: 'Ohio', circuit: '6th' },
        { name: 'Oklahoma', circuit: '10th' },
        { name: 'Oregon', circuit: '9th' },
        { name: 'Pennsylvania', circuit: '3rd' },
        { name: 'Rhode Island', circuit: '1st' },
        { name: 'South Carolina', circuit: '4th' },
        { name: 'South Dakota', circuit: '8th' },
        { name: 'Tennessee', circuit: '6th' },
        { name: 'Texas', circuit: '5th' },
        { name: 'Utah', circuit: '10th' },
        { name: 'Vermont', circuit: '2nd' },
        { name: 'Virginia', circuit: '4th' },
        { name: 'Washington', circuit: '9th' },
        { name: 'West Virginia', circuit: '4th' },
        { name: 'Wisconsin', circuit: '7th' },
        { name: 'Wyoming', circuit: '10th' },
      ],
    };
    // Initialize selected states
    this.selectedStates = ['California', 'New York'];
    // Initialize selected circuits as an empty array
    this.selectedCircuits = [];
    this.uniqueCircuits = this.getUniqueCircuits();
    // Update selectedCircuits based on selectedStates
    this.updateSelectedCircuits();
  }

  render() {
    return html`
      <div id="main">
        <section>
          <h2>States</h2>
          <div class="states-list">
            ${this.data.states.map(
              (state) => html`
                <div>
                  <input
                    type="checkbox"
                    name="${state.name}"
                    ?checked="${this.isStateSelected(state.name)}"
                    @change="${this.handleStateCheckboxChange}"
                  />
                  ${state.name}
                </div>
              `
            )}
          </div>
        </section>
        <section>
          <h2>Circuits</h2>
          <div class="circuits-list">
            ${this.uniqueCircuits.map(
              (circuit) => html`
                <div>
                  <input
                    type="checkbox"
                    value="${circuit}"
                    ?checked="${this.isCircuitSelected(circuit)}"
                    @change="${this.handleCircuitCheckboxChange}"
                  />
                  ${circuit}
                </div>
              `
            )}
          </div>
        </section>
      </div>
    `;
  }

  getUniqueCircuits() {
    const circuits = this.data.states.map((state) => state.circuit);
    const uniqueCircuits = [];
    circuits.forEach((circuit) => {
      if (!uniqueCircuits.includes(circuit)) {
        uniqueCircuits.push(circuit);
      }
    });
    uniqueCircuits.sort((a, b) => {
      const getNumber = (str) => parseInt(str.match(/\d+/)[0], 10);
      return getNumber(a) - getNumber(b);
    });
    return uniqueCircuits;
  }

  getSelectedCircuits() {
    const selectedCircuits = this.data.states
      .filter(state => this.selectedStates.includes(state.name))
      .map(state => state.circuit);
    
    // Filter out duplicates
    return selectedCircuits.filter((circuit, index, self) =>
      index === self.indexOf(circuit)
    );
  }

  updateSelectedCircuits() {
    this.selectedCircuits = this.getSelectedCircuits();
  }

  isStateSelected(stateName) {
    return this.selectedStates.includes(stateName);
  }

  handleStateCheckboxChange(event) {
    const { name, checked } = event.target;
    if (checked) {
      this.selectedStates = [...this.selectedStates, name];
    } else {
      this.selectedStates = this.selectedStates.filter((stateName) => stateName !== name);
    }
    this.updateSelectedCircuits(); // Update circuits based on selected states
    this.requestUpdate(); // Ensures the UI updates
  }

  isCircuitSelected(circuit) {
    return this.selectedCircuits.includes(circuit);
  }

  handleCircuitCheckboxChange(event) {
    const { value, checked } = event.target;
    if (checked) {
      this.selectedCircuits = [...this.selectedCircuits, value];
      this.updateSelectedStates(value, true);
    } else {
      this.selectedCircuits = this.selectedCircuits.filter((circuit) => circuit !== value);
      this.updateSelectedStates(value, false);
    }
    this.requestUpdate(); // Ensures the UI updates
  }

  updateSelectedStates(circuit, add) {
    const statesInCircuit = this.data.states
      .filter((state) => state.circuit === circuit)
      .map((state) => state.name);
    if (add) {
      statesInCircuit.forEach((stateName) => {
        if (!this.selectedStates.includes(stateName)) {
          this.selectedStates = [...this.selectedStates, stateName];
        }
      });
    } else {
      this.selectedStates = this.selectedStates.filter(
        (stateName) => !statesInCircuit.includes(stateName)
      );
    }
    this.updateSelectedCircuits(); // Update circuits based on selected states
  }
}

window.customElements.define('my-element', MyElement);
