// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

import users from "../../test/fixtures/users.json";
import assert from "assert";

Cypress.Commands.add("login", username => {
	const usernames = Object.keys(users);
	assert.ok(usernames.includes(username));

	cy.request({
		url: "api/v1/login",
		method: "post",
		body: {
			email: users[username].email,
			password: users[username].password,
		},
	});
});
