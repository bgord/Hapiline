/* eslint-disable */

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

const isValid = (_chai, _utils) => {
	function assertIsValid(_options) {
		const validity = this._obj.get(0).checkValidity();
		this.assert(
			validity === true,
			"expected #{this} to be a valid input",
			"expected #{this} to be an invalid input",
			this._obj,
		);
	}

	_chai.Assertion.addMethod("valid", assertIsValid);
};
// registers our assertion function "isValid" with Chai
chai.use(isValid);

import "cypress-axe";
import "cypress-plugin-tab";
