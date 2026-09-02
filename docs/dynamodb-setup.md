SMARTMEAL AWS DYNAMODB SETUP DOCUMENTATION

This document contains the complete AWS DynamoDB setup used by the SmartMeal application. It is intended as a reference for recreating the same setup in another AWS account in the future.

==================================================
1. AWS REGION
==================================================

AWS Region:

ap-south-1

Region name:

Asia Pacific (Mumbai)

All DynamoDB resources described in this document were created in ap-south-1.

AWS CLI commands use:

--region ap-south-1


==================================================
2. DYNAMODB TABLE 1: smartmeal-foods
==================================================

Table name:

smartmeal-foods

Primary key configuration:

Partition key:
userId

Type:
String

Sort key:
foodId

Type:
String

Therefore:

Partition Key = userId
Sort Key = foodId


Table configuration:

Table class:
DynamoDB Standard

Capacity mode:
Provisioned

Read capacity:
5 RCU

Write capacity:
5 WCU

Auto scaling:
Disabled

Global secondary indexes:
None

Streams:
Disabled

Point-in-time recovery:
Disabled

Global tables:
Disabled

Deletion protection:
Disabled


==================================================
3. smartmeal-foods DATA STRUCTURE
==================================================

The smartmeal-foods table stores the user's food library.

Each food belongs to a specific user.

The DynamoDB primary key is:

userId + foodId

Example:

userId = cognito-user-sub-123
foodId = food-550e8400-e29b-41d4-a716-446655440000

Multiple foods can belong to the same user:

userA | food-001
userA | food-002
userA | food-003

Another user can have:

userB | food-001
userB | food-002

This is valid because DynamoDB identifies an item using the complete partition key and sort key combination.


==================================================
4. smartmeal-foods SAMPLE DATA
==================================================

Example food record:

{
  "userId": "Cognito-user-sub",
  "foodId": "food-uuid",
  "name": "Masala Dosa",
  "mealType": "Breakfast",
  "ingredients": [
    "Rice",
    "Urad dal",
    "Potato",
    "Oil"
  ],
  "calories": 410,
  "protein": "10g",
  "carbs": "68g",
  "fat": "12g",
  "createdAt": "2026-09-01T00:00:00.000Z"
}


Another example:

{
  "userId": "Cognito-user-sub",
  "foodId": "food-uuid-002",
  "name": "Chicken Biryani",
  "mealType": "Lunch",
  "ingredients": [
    "Rice",
    "Chicken",
    "Onion",
    "Spices"
  ],
  "calories": 550,
  "protein": "30g",
  "carbs": "70g",
  "fat": "18g",
  "createdAt": "2026-09-02T00:00:00.000Z"
}


==================================================
5. DYNAMODB TABLE 2: smartmeal-plans
==================================================

Table name:

smartmeal-plans

Primary key configuration:

Partition key:
userId

Type:
String

Sort key:
planKey

Type:
String

Therefore:

Partition Key = userId
Sort Key = planKey


Table configuration:

Table class:
DynamoDB Standard

Capacity mode:
Provisioned

Read capacity:
5 RCU

Write capacity:
5 WCU

Auto scaling:
Disabled

Global secondary indexes:
None

Streams:
Disabled

Point-in-time recovery:
Disabled

Global tables:
Disabled

Deletion protection:
Disabled


==================================================
6. smartmeal-plans DATA STRUCTURE
==================================================

The smartmeal-plans table stores the meal plans created for users.

The DynamoDB primary key is:

userId + planKey


The planKey follows this format:

DATE#YYYY-MM-DD#MEAL#MealType#PLAN#plan-uuid


Example:

DATE#2026-09-01#MEAL#Breakfast#PLAN#plan-123


Another example:

DATE#2026-09-01#MEAL#Lunch#PLAN#plan-456


==================================================
7. smartmeal-plans SAMPLE DATA
==================================================

Example plan record:

{
  "userId": "Cognito-user-sub",
  "planKey": "DATE#2026-09-01#MEAL#Breakfast#PLAN#plan-uuid",
  "date": "2026-09-01",
  "mealType": "Breakfast",
  "foodId": "food-uuid",
  "name": "Masala Dosa",
  "ingredients": [
    "Rice",
    "Urad dal",
    "Potato"
  ],
  "calories": 410,
  "completed": false
}


==================================================
8. IAM USER
==================================================

An IAM user was created for local development:

smartmeal-local-dev

An IAM access key was created for this user.

The access key was configured in the local AWS CLI profile:

smartmeal-local


IMPORTANT:

Never commit the AWS Access Key ID or AWS Secret Access Key to GitHub.

Never put AWS secret credentials directly into frontend/browser JavaScript.

Never store real credentials inside this documentation file.


==================================================
9. IAM POLICY
==================================================

The IAM user smartmeal-local-dev has a policy allowing access to the two SmartMeal DynamoDB tables.

The policy is:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SmartMealDynamoDbAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/smartmeal-foods",
        "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/smartmeal-plans"
      ]
    }
  ]
}


When recreating the setup in another AWS account, replace:

YOUR_ACCOUNT_ID

with the AWS account ID of the new account.

For example:

arn:aws:dynamodb:ap-south-1:123456789012:table/smartmeal-foods

arn:aws:dynamodb:ap-south-1:123456789012:table/smartmeal-plans


==================================================
10. AWS CLI CONFIGURATION
==================================================

The AWS CLI profile used for local development is:

smartmeal-local

It was configured using:

aws configure --profile smartmeal-local


The configuration contains:

AWS Access Key ID:
IAM access key for smartmeal-local-dev

AWS Secret Access Key:
IAM secret access key for smartmeal-local-dev

Default region:
ap-south-1

Default output format:
json


IMPORTANT:

The actual access key and secret access key must never be written into this document.

The credentials are stored in the local AWS CLI configuration.

The profile can be used by adding:

--profile smartmeal-local

to AWS CLI commands.


==================================================
11. VERIFY AWS CLI CONNECTION
==================================================

To verify which AWS account and IAM identity are being used:

aws sts get-caller-identity --profile smartmeal-local


This command should return information about:

Account
UserId
Arn


This is especially important when switching to another AWS account.

Always verify the account before creating or modifying resources.


==================================================
12. CHECK smartmeal-foods TABLE
==================================================

Run:

aws dynamodb describe-table --table-name smartmeal-foods --region ap-south-1 --profile smartmeal-local


==================================================
13. CHECK smartmeal-plans TABLE
==================================================

Run:

aws dynamodb describe-table --table-name smartmeal-plans --region ap-south-1 --profile smartmeal-local


==================================================
14. TESTING GETITEM
==================================================

For smartmeal-foods, both primary-key values are required:

userId
foodId


Example test-key.json:

{
  "userId": {
    "S": "ap-south-1_demo_user"
  },
  "foodId": {
    "S": "food_demo_101"
  }
}


Then run:

aws dynamodb get-item --table-name smartmeal-foods --key file://test-key.json --region ap-south-1 --profile smartmeal-local


IMPORTANT:

PowerShell can sometimes modify JSON quotation marks when JSON is passed directly as a command argument.

Using a JSON file with file:// is more reliable.


==================================================
15. TESTING PUTITEM
==================================================

Example test-item.json:

{
  "userId": {
    "S": "ap-south-1_demo_user"
  },
  "foodId": {
    "S": "food_test_001"
  },
  "name": {
    "S": "Test Dosa"
  },
  "mealType": {
    "S": "Breakfast"
  },
  "calories": {
    "N": "410"
  },
  "protein": {
    "S": "10g"
  },
  "carbs": {
    "S": "68g"
  },
  "fat": {
    "S": "12g"
  },
  "createdAt": {
    "S": "2026-09-02T05:00:00.000Z"
  }
}


Run:

aws dynamodb put-item --table-name smartmeal-foods --item file://test-item.json --region ap-south-1 --profile smartmeal-local


If the command returns without an error, the PutItem operation succeeded.


==================================================
16. VERIFY THE TEST ITEM
==================================================

Create test-key.json:

{
  "userId": {
    "S": "ap-south-1_demo_user"
  },
  "foodId": {
    "S": "food_test_001"
  }
}


Run:

aws dynamodb get-item --table-name smartmeal-foods --key file://test-key.json --region ap-south-1 --profile smartmeal-local


The returned item should contain the Test Dosa record.


==================================================
17. POWERSHELL JSON ENCODING NOTE
==================================================

When passing JSON directly to AWS CLI from PowerShell, quotation marks may sometimes be removed.

This can produce errors such as:

Invalid JSON

or:

Expected property name enclosed in double quotes


Using a JSON file is recommended:

file://test-item.json

When creating JSON files from PowerShell, ASCII encoding can be used:

'{"userId":{"S":"test"},"foodId":{"S":"test-001"}}' | Set-Content test.json -Encoding ascii


This also avoids the UTF-8 BOM issue that can produce characters such as:

ï»¿


==================================================
18. SMARTMEAL APPLICATION CONNECTION
==================================================

The intended application data flow is:

User
  |
  | Enters food
  v
Add New Food Item Form
  |
  | Form state
  v
Save Food Item
  |
  | Create food object
  v
Authenticated Cognito User
  |
  | Cognito user sub
  v
Backend / API / DynamoDB layer
  |
  | PutItem / PutCommand
  v
smartmeal-foods


For meal plans:

User
  |
  v
Meal Planner
  |
  | Create plan
  v
Backend / API / DynamoDB layer
  |
  | PutItem / PutCommand
  v
smartmeal-plans


==================================================
19. COGNITO USER ID
==================================================

The intended userId stored in DynamoDB is the authenticated Cognito user's:

sub


Example:

userId = <actual-cognito-user-sub>


The application should NOT use a fixed user ID for real authenticated users.

Development/demo values such as:

ap-south-1_demo_user

local_dev_user_001

should only be used if the application intentionally supports local/mock development mode.


==================================================
20. FOOD ID GENERATION
==================================================

Every new food should have a unique foodId.

Recommended JavaScript implementation:

crypto.randomUUID()


Example:

food-b2f7eb68-2358-4cd6-9da4-8228b25c7762


Every new food should receive a new foodId.

Do not reuse:

food_demo_101

for every food.


==================================================
21. FOOD FORM DATA
==================================================

The application must save the values actually entered by the user.

Example:

Food Name:
Chicken Biryani

Meal Type:
Lunch

Ingredients:
Rice, Chicken, Onion, Spices

Calories:
550

Protein:
30g

Carbs:
70g

Fat:
18g


The resulting DynamoDB item should be similar to:

{
  "userId": "<actual-cognito-user-sub>",
  "foodId": "<new-uuid>",
  "name": "Chicken Biryani",
  "mealType": "Lunch",
  "ingredients": [
    "Rice",
    "Chicken",
    "Onion",
    "Spices"
  ],
  "calories": 550,
  "protein": "30g",
  "carbs": "70g",
  "fat": "18g",
  "createdAt": "<timestamp>"
}


Form placeholders such as:

e.g., Masala Dosa

e.g., Rice, Urad dal, Potato, Oil


must NOT be saved as actual user data.

The placeholder is only an example for the user.


==================================================
22. BROWSER STORAGE
==================================================

The application should not silently use localStorage, sessionStorage, IndexedDB, or other browser storage as a replacement for DynamoDB if DynamoDB is intended to be the persistent source of truth.

If DynamoDB/API saving fails:

1. Capture the error.
2. Log the error during development.
3. Show an appropriate error message to the user.
4. Do not tell the user that the food was successfully saved when it was not.

If browser storage is intentionally used as a cache, it should remain a cache and should not replace DynamoDB persistence.


==================================================
23. DYNAMODB FOOD RECORD RULES
==================================================

Every food record must contain:

userId
foodId
name
mealType
ingredients
calories
protein
carbs
fat
createdAt


Example:

{
  "userId": "Cognito-user-sub",
  "foodId": "food-uuid",
  "name": "Masala Dosa",
  "mealType": "Breakfast",
  "ingredients": [
    "Rice",
    "Urad dal",
    "Potato",
    "Oil"
  ],
  "calories": 410,
  "protein": "10g",
  "carbs": "68g",
  "fat": "12g",
  "createdAt": "2026-09-01T00:00:00.000Z"
}


==================================================
24. DYNAMODB PLAN RECORD RULES
==================================================

Every plan record should contain:

userId
planKey
date
mealType
foodId
name
ingredients
calories
completed


Example:

{
  "userId": "Cognito-user-sub",
  "planKey": "DATE#2026-09-01#MEAL#Breakfast#PLAN#plan-uuid",
  "date": "2026-09-01",
  "mealType": "Breakfast",
  "foodId": "food-uuid",
  "name": "Masala Dosa",
  "ingredients": [
    "Rice",
    "Urad dal",
    "Potato"
  ],
  "calories": 410,
  "completed": false
}


==================================================
25. SECURITY
==================================================

Never commit AWS credentials to GitHub.

Never put AWS_SECRET_ACCESS_KEY directly into frontend/browser JavaScript.

Never put real credentials inside this documentation file.

Never commit a .env file containing secret credentials.

The AWS CLI profile:

smartmeal-local

is intended for local development.

For production environments, IAM roles and temporary credentials should be preferred over long-lived IAM access keys wherever possible.


==================================================
26. RECREATING THE SETUP IN ANOTHER AWS ACCOUNT
==================================================

When recreating SmartMeal in another AWS account, follow these steps.


STEP 1: Select AWS Region

Use:

ap-south-1


STEP 2: Create DynamoDB Table smartmeal-foods

Table name:

smartmeal-foods

Partition key:

userId

Type:

String

Sort key:

foodId

Type:

String

Table class:

DynamoDB Standard

Capacity mode:

Provisioned

Read capacity:

5

Write capacity:

5

Auto scaling:

Disabled

Global secondary indexes:

None

Streams:

Disabled

Point-in-time recovery:

Disabled

Global tables:

Disabled

Deletion protection:

Disabled


STEP 3: Create DynamoDB Table smartmeal-plans

Table name:

smartmeal-plans

Partition key:

userId

Type:

String

Sort key:

planKey

Type:

String

Table class:

DynamoDB Standard

Capacity mode:

Provisioned

Read capacity:

5

Write capacity:

5

Auto scaling:

Disabled

Global secondary indexes:

None

Streams:

Disabled

Point-in-time recovery:

Disabled

Global tables:

Disabled

Deletion protection:

Disabled


STEP 4: Create IAM User

Create IAM user:

smartmeal-local-dev

Create an access key for the user.

Attach the SmartMeal DynamoDB policy described in this document.

Replace YOUR_ACCOUNT_ID in the policy with the account ID of the new AWS account.


STEP 5: Configure AWS CLI

Run:

aws configure --profile smartmeal-local


Enter the new IAM user's access key and secret access key.

Use:

Region:

ap-south-1

Output format:

json


STEP 6: Verify AWS Account

Run:

aws sts get-caller-identity --profile smartmeal-local


Make sure the returned Account value is the NEW AWS account.


STEP 7: Verify smartmeal-foods

Run:

aws dynamodb describe-table --table-name smartmeal-foods --region ap-south-1 --profile smartmeal-local


STEP 8: Verify smartmeal-plans

Run:

aws dynamodb describe-table --table-name smartmeal-plans --region ap-south-1 --profile smartmeal-local


STEP 9: Test Write

Use test-item.json and run:

aws dynamodb put-item --table-name smartmeal-foods --item file://test-item.json --region ap-south-1 --profile smartmeal-local


STEP 10: Test Read

Use test-key.json and run:

aws dynamodb get-item --table-name smartmeal-foods --key file://test-key.json --region ap-south-1 --profile smartmeal-local


STEP 11: Configure Application

The application should use:

AWS Region:
ap-south-1

Foods table:
smartmeal-foods

Plans table:
smartmeal-plans


The application should obtain the authenticated Cognito user's sub and use it as userId.


==================================================
27. COMPLETE CONFIGURATION SUMMARY
==================================================

AWS Region:

ap-south-1


DynamoDB Table 1:

smartmeal-foods


smartmeal-foods Partition Key:

userId

Type:

String


smartmeal-foods Sort Key:

foodId

Type:

String


DynamoDB Table 2:

smartmeal-plans


smartmeal-plans Partition Key:

userId

Type:

String


smartmeal-plans Sort Key:

planKey

Type:

String


Table Class:

DynamoDB Standard


Capacity Mode:

Provisioned


Read Capacity:

5


Write Capacity:

5


Auto Scaling:

Disabled


Global Secondary Indexes:

None


Streams:

Disabled


Point-in-Time Recovery:

Disabled


Global Tables:

Disabled


Deletion Protection:

Disabled


IAM User:

smartmeal-local-dev


AWS CLI Profile:

smartmeal-local


AWS Region:

ap-south-1


==================================================
28. COMPLETE ARCHITECTURE
==================================================

                         AWS ACCOUNT
                              |
                              |
                         ap-south-1
                              |
              +---------------+---------------+
              |                               |
              v                               v
       smartmeal-foods                 smartmeal-plans
              |                               |
       PK: userId                       PK: userId
       SK: foodId                       SK: planKey
              |                               |
              +---------------+---------------+
                              |
                              v
                       SMARTMEAL APP
                              |
                              v
                         COGNITO AUTH
                              |
                              v
                    AUTHENTICATED USER
                              |
                              v
                         USER SUB


==================================================
29. FINAL RECREATION CHECKLIST
==================================================

AWS:

[ ] AWS account selected
[ ] Region set to ap-south-1


DynamoDB smartmeal-foods:

[ ] Table created
[ ] Partition key = userId
[ ] userId type = String
[ ] Sort key = foodId
[ ] foodId type = String
[ ] Table class = DynamoDB Standard
[ ] Capacity mode = Provisioned
[ ] Read capacity = 5
[ ] Write capacity = 5
[ ] Auto scaling = Disabled
[ ] GSI = None
[ ] Streams = Disabled
[ ] Point-in-time recovery = Disabled
[ ] Global tables = Disabled
[ ] Deletion protection = Disabled


DynamoDB smartmeal-plans:

[ ] Table created
[ ] Partition key = userId
[ ] userId type = String
[ ] Sort key = planKey
[ ] planKey type = String
[ ] Table class = DynamoDB Standard
[ ] Capacity mode = Provisioned
[ ] Read capacity = 5
[ ] Write capacity = 5
[ ] Auto scaling = Disabled
[ ] GSI = None
[ ] Streams = Disabled
[ ] Point-in-time recovery = Disabled
[ ] Global tables = Disabled
[ ] Deletion protection = Disabled


IAM:

[ ] IAM user smartmeal-local-dev created
[ ] Access key created
[ ] DynamoDB policy created
[ ] Policy attached to smartmeal-local-dev
[ ] YOUR_ACCOUNT_ID replaced with actual account ID


AWS CLI:

[ ] AWS CLI installed
[ ] Profile smartmeal-local configured
[ ] Region set to ap-south-1
[ ] aws sts get-caller-identity tested
[ ] Correct AWS account verified
[ ] smartmeal-foods describe-table tested
[ ] smartmeal-plans describe-table tested
[ ] PutItem tested
[ ] GetItem tested


Application:

[ ] AWS region configured as ap-south-1
[ ] smartmeal-foods configured
[ ] smartmeal-plans configured
[ ] Cognito configured
[ ] Authenticated Cognito sub used as userId
[ ] Unique foodId generated for every food
[ ] Unique planKey generated for every plan
[ ] Food data comes from actual form state
[ ] Demo food data removed from normal flow
[ ] Browser storage does not silently replace DynamoDB
[ ] DynamoDB errors are handled correctly
[ ] AWS secret keys are not exposed in frontend code
[ ] AWS credentials are not committed to GitHub


==================================================
30. IMPORTANT NOTE FOR FUTURE RECREATION
==================================================

This document describes the infrastructure configuration used for SmartMeal.

The AWS account ID, IAM access keys, IAM secret keys, Cognito IDs, Cognito secrets, and other account-specific values are intentionally not stored here.

When moving to another AWS account:

1. Create/select the new AWS account.
2. Use region ap-south-1.
3. Create both DynamoDB tables with exactly the same key configuration.
4. Use Provisioned capacity with 5 RCU and 5 WCU.
5. Keep auto scaling disabled.
6. Keep GSI, Streams, PITR, Global Tables, and Deletion Protection disabled.
7. Create the IAM user smartmeal-local-dev.
8. Create a new access key.
9. Update the IAM policy with the NEW AWS account ID.
10. Configure the AWS CLI profile smartmeal-local with the new credentials.
11. Verify the account using aws sts get-caller-identity.
12. Test both DynamoDB tables.
13. Update the application configuration if required.
14. Make sure Cognito is connected to the new environment if Cognito is also being recreated.
15. Make sure the application uses the authenticated Cognito user's sub as userId.
16. Never copy old AWS secret credentials into the new environment.

This completes the SmartMeal AWS DynamoDB setup documentation.