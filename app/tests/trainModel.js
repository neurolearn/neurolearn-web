module.exports = {
  'Sign In': function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('h1', 1000)
      .click('a[href^=\'http://neurovault.org\']')
      .waitForElementVisible('input[id=\'id_username\']', 1000)
      .setValue('input[id=\'id_username\']', 'testuser')
      .setValue('input[id=\'id_password\']', 'testuser')
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('a[id=user-account-dropdown] > span', 'testuser')
      .end();
  }
};
