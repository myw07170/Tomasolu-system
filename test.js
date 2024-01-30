function assert(condition, message) 
{
    if (!condition)
        throw message;
}

function apply_test(test_func_list, print=console.log) 
{
    let test_passed = true;
    _.each(test_func_list, function (test_func, index) {
        try 
        {
            test_func();
        }
        catch (err) 
        {
            test_passed = false;
            print("tomasolu core test " + index + " failed: " + err);
        }
    });
    if (test_passed)
        print("info: tomasolu core test passed");
    return test_passed;
}