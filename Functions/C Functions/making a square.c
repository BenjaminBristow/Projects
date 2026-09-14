#include <stdio.h>

int main()
{
    int sides;
    int i, j;
    printf("enter a side length: \n");
    scanf("%d", &sides);

    //top
    for(i=0; i<sides; i++)
    {
        printf("* ");
    }
    printf("\n");

    //middle
    for(i=0; i<sides-2; i++)
    {
        printf("* ");
        for(j=0; j<sides-2; j++)
        {
            printf("  ");
        }
        printf("*\n");
    }

    //bottom
    for(i=0; i<sides; i++)
    {
        printf("* ");
    }
    printf("\n");
return 0;
}