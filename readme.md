# Klaviyo Unsubscribe

## Endpoint

Customer clicks on a link within an email to "Unsubscribe". It brings them to a page where they have the ability to change the frequency of when then get emails, as well as set it to "Never".

Because we can't access get variables in shopify we have to have the page on a server. This will allow us to provide a link like

```
https://klaviyo-unsubscribe.herokuapp.com/?email=thomas@holstee.com
```
Then the form can populate with the email address so they don't have to enter it.


## Frequency based - Server / Action

```
https://klaviyo-unsubscribe.herokuapp.com/action
```

The form request hits the server via POST with the following required fields:

* Email
* Frequency
  * weekly
  * monthly
  * quarterly
  * yearly
  * never

The two-fold Klaviyo interaction takes place

* Send to customer property of `frequency: req.body.frequency` to Klaviyo
* Send event "Frequency change / Unsubscribed" to Klaviyo

Send a response back to the user via ajax.

* Your frequency has been change!
* You have been unsubscribed!

## Content based - server / action

```
https://klaviyo-unsubscribe.herokuapp.com/action
```

The form request hits the server via POST with the following required fields:

* Email

management vs flat removal from current subscription

---

# Frequency and content based server action

```
method: POST
url: https://klaviyo-unsubscribe.herokuapp.com/action
```

Required body fields:

* email
* content["products"] (radio)
	* weekly
	* monthly
	* quarterly
	* yearly
	* never
* content["mindful matter"] (radio)
	* yes
	* no
