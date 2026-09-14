#include <stdio.h>
#include <unistd.h>

int factorial(int input)
{
    if (input <= 1)
    {
        return 1;
    }
    return input * factorial(input-1);
}

int main()
{
    int rowswanted;
    printf("How many rows do you want? ");
    scanf("%d", &rowswanted);


    //n=x r=y
    int x, y, elementsInRow, i;
    for(y=0; y<rowswanted; y++)
    {
        for(i=0; i<(rowswanted-y); i++)
        {
            printf(" ");
        }
        int result;
        elementsInRow = y+1;
        for(x=0; x<elementsInRow; x++)
        {
            result = factorial(y)/(factorial(x)*factorial(y-x));
            printf("%d ", result);
        }
        printf("\n");
    }
}
