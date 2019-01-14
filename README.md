  @alertlogic/subscriptions
=========

A client for interacting with the Alert Logic Subscriptions Public API.

This library uses @alertlogic/client as its HTTP provider interface.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @alertlogic/subscriptions --save

## Usage

      var SubscriptionssClient = require('@alertlogic/subscriptions')
  
  Get Entitlements

    SubscriptionsClient.getEntitlements(accountId, queryParams)
      accountId: '1234',
      queryParams: {
          product_family: 'assess|detect|respond|cloud_insight|threat_manager|log_manager|active_watch_premier|web_security_managed|cloud_defender|ids_data_retention|log_data_retention|log_review',
          status: true|false,
          filter_bundles: true|false,
        }
    
    List Account Ids with a provided entitlement
    
      SubscriptionsClient.getAccountsByEntitlement(accountId, productFamily)
        accountId: '1234',
        productFamily: 'assess|detect|respond|cloud_insight|threat_manager|log_manager|active_watch_premier|web_security_managed|cloud_defender|ids_data_retention|log_data_retention|log_review',
    
    Create AWS subscriptions for the provided customer.

      createAWSSubscription(accountId, subscription)
        accountId: '1234',
        subscription: {
          product_code: '',
          aws_customer_identifier: '',
          status: 'active',
          account_id: '1234',
        }
    
    Create full subscriptions

      createFullSubscription(accountId, entitlements)
        accountId: '1234',
        entitlements: [
          {"product_family":"assess|detect|respond|cloud_insight|threat_manager|log_manager|active_watch_premier|web_security_managed|cloud_defender|ids_data_retention|log_data_retention|log_review",
            "status": 'active|canceled|pending_activation',
            "end_date": Timestamp,
            "value_type": 'months', // Only allowed when product_family is ids_data_retention or log_data_retention
            "value": #Months, // Only allowed when product_family is ids_data_retention or log_data_retention}
        ]
    
    Create standard subscriptions for the provided customer.

      createStandardSubscription(accountId)
        accountId: '1234',
    
    Get subscription

      getSubscription(accountId, subscriptionId)
        accountId: '1234',
        subscriptionId: 'UUID-GOES-HERE',
    
    Get subscriptions

      getSubscriptions(accountId)
        accountId: '1234',
    
    Update AWS subscription

      updateAWSSubscription(accountId, subscription)
        accountId: '1234',
        subscription: {
          product_code: '',
          aws_customer_identifier: '',
          status: 'unsubscribe-success',
          account_id: '1234',
        }

## Interactive

  Loads the library into memory and stays in an interactive node shell.
  
      npm run interactive

## Tests

      npm test

## Linting

      npm run lint

## Contributing

This repository follows the eslint airbnb style.

## Release History

* 0.1.0 Initial release
