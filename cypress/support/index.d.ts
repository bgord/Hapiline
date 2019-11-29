// cypress/support/index.d.ts file
// extends Cypress assertion Chainer interface with
// the new assertion methods

/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainer<Subject> {
		/**
     * Custom Chai assertion that checks if given subject is a valid input
     *
     * @example
     ```
    expect('foo').to.be.valid()
    cy.wrap('foo').should('be.valid')
    ```
    **/
		(chainer: "be.valid"): Chainable<Subject>;

		/**
     * Custom Chai assertion that checks if given subject is NOT a valid input
     *
     * @example
     ```
    expect('bar').to.not.be.valid()
    cy.wrap('bar').should('not.be.valid')
    ```
    **/
		(chainer: "not.be.valid"): Chainable<Subject>;
	}
}
