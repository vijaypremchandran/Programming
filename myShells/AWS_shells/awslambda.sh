#!/bin/bash

# This shell will have some cli for lamda function. 

# The name of the function is passed as argument to this shell. 
# $# : saves the total number of argurment passed to the shell
# $0 : script name.
# $1 : first argument passed.
# Since this shell needs atleast one arguement passed, Let's check that and 
# skip the run if the function is not passed.

echo "Total Num of Parameters : $#"
echo "Function-name 	      : $1"

# Validate if the argument is passed, if not exit shell
if [ $# -gt 0 ]
then
	echo "Function name passed, Good to proceed.."
else
	echo "Please pass a function name"
	exit 1
fi

# get the function name passed into a shell variable.

functionName=$1

#Declare a function to list functions.
list_lambda_functions ()
{
	aws lambda list-functions
}

# List the functions before delete.
echo  " AWS functions before delete .."
list_lambda_functions

# Delete the function
aws lambda delete-function --function-name ${functionName}

# List the functions after delete.
echo "AWS functions after delete .."
list_lambda_functions

echo " End of Script : $?"
exit 2
