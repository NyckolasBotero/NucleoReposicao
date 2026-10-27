const LOGO_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAowAAAESCAYAAAB3t4R4AABB5ElEQVR42u2dTXbjOpK2I7NvT2qe3kKfQ+YitIEa9IDqPdStPYhaRN0F1FDsPXR6D0luwovwN0jhM4zETwRJSKT0POf4pJ2WQxB+iBcBRODL3/7+bwEAAAAASPGVKgAAAACAHH9QBQC/0QQ/T1QJAAAgGAEQe+HfNCLSJuyNiEgAAEAwAtxO3IWibFgg9BytiHSe3eH6ZbE5ecKxu361VztdUF4EJAAAPDT/8Z//9d/UAtyLt+u/X0TkmyfA/vSE5Jv3Oq1N5wV04vF4tdlf/+8gIi9BGXL2XkXkx/VfV66DJ0xfVhC5AAAAm+ULUdKwMTrvy8d5CccZ4uwkHx5CSdgdDPaaq/gMyzh6NiejTQAAAAQjwAzheIqIPLf9O0p8m7nJiMnGE3Ux4TiKyHkFceuXky1rAADYPWxJw1aZROSvq+B68YSj+95tYYdb1rkt5rervdereHzxftfKr23m3nuvSVFG50U8BL9z5XRb1qPYttYBAAA2Ax5G2Au5bWW5Cr21vIMSCMmYcAw9mVp7w7WseBwBAGA34GGEvfAWiKyX4PcH+QhqeRGdd9B5/b559sbA9p+BSH0L/vXtDcHvXhIC9E/vdXgdAQAAwQiwsmAcrt+nPHkH73evCpsuAvpNPkdPhyLPbS2XAlle5eOc5LeEPVfOQ0QIAwAAIBgBVsI/15gTjt/kd09e4/2/eL93ojFFKx9ezFeFEH3z/s7Re0LyxRO3eBsBAADBCLAiLnjFJdZ+yYjKg/wedOK2oUPR+Cqfg2tKYvRHQeTFtr2/Rewfrl/fEI4AAIBgBFhO4wmq6SraDgWBJ/KxreyfM4wJs0F+RWe3EvdgujOOL/LrLKK7ESYnbn1RmiqrL27nJCwHAABAMAJ4oiv8+YcnwlJizAnAQSnERolvUb8F76E5L+m8l6N8BLzkhK0vKjnfCAAAd+crVQAbo5nxukl+Xf/3XSkEf2be5+TZPF/thoIupL/+Xansk/y6BvGoKKc2TQ8AAACCEZ6OaeHrvsjn21xiN7u0InKJiLFGfs/lOFxfPxbK019foxF4w1U0jhExG4rGiydiAQAA7gJb0vCI/JCPbV0X8BJuVb9ExGdqq9oPkimdlXQR2KWUPtPVrh+0k0vB437PFjUAANwcbnqBR+bd+36U5bfEOI+fhl7id13HbFq2nr/QrAAAcGvwMMIjM3lCrJQmpxTtLN7vNZ7GbxK/ISZls1HY9G0RQQ0AAAhGgJUEoy8ac2i3kl1C7pJNF5ndeH+XK+eb/PKCHgp2D6K7cQYAAGA1CHqBR8SPVh6kHLAi8nGLiyVoRZR2WylHUA+i2xYXsW2NAwAALAYPIzwi4XbtX9d/D0qxqQ1aKd0044tG//rBkl33NxohOgrb0wAAUBk8jPDI+F69s+g9jZ2kPYKh91K7NdyLzivovJcpu/5nIE8jAADcBDyM8MjEPI2pK/+cGHOpeA7Xv58KNl+v4u4gZU/ji2ej5BV0gvGQsCHe7zX3WgMAACAYAZSMkr/POfxes+Xr8jQeFO//zROaJdy90hoh+qa0CQAAgGAEUIi7MMp5TIiy1iDEXkUXkf1yFY0x72UTiNPJ+7l0ptEJVqKnAQAAwQiwAk6oHTwRl+IQCM2S3U50HsEmIhrfEjZzXlHfZiu6fJIAAAAIRgAFr0px50Sj1tPovIclj2BKNMawbHl33ucDAABAMAIs5IeI/Jn4XbhN/U10gSVOqGnPHlpE45tSNB4QjQAAgGAEWIe3QGCFYi78+SAfOR1zTKL3CLr3GRRlfZVf6Xk0IBoBAGA1yMMIz44mP6P7vebGltjflWhEn0+xdHNNmKexoYkBAADBCLCcYyC0xuDnNvidRoSdE3ZjOCHaBCIyVdacN7INvu8VNgEAALKwJQ3wa/vYT+jtknensATAhHZzrxXPbu6spDY/oy8gX4XE3gAAgGAEmM2bfNwhrRFhqTyKMbsiuu3mF4NdzRlJP2jnEIhRAAAABCPATNEosm6gihN3uesIQ7uN6AJr3uQj92KujL7I/YtmBgAABCPAMsH4Juk0OzF+iH6bV7uF/CK65NtvCbupW2u0dgEAAH6DoBeADybRX63Xii2y2XJlnza62dnVRmNfaGIAAJgDHkaAz2iu4XMcRO+1ezPYba+v04jMV/l8nvFFWRYCYAAAQA0eRoDPWLdtO6NdS27GxmB7jAjfGL2hzAAAAAhGgAQpz96YEIxaAXZUvMZPEm7Z8g5Fbi7IpqWJAQAAwQiwjDEhGlNCy5IQu+S9DBNvN4Yya7HcLAMAAMAZRoAIYf7EUT7S2MT4JnUiplvRJwkvpdnxsaTvAQAAwMMIkKAUcBJeHdga7FrPSGq8jNoI7zlb3gAAgGAEAIW4CgVhGxF2c8VobjvZKkatW9MAAABF2JIGSFO6fi9Ec62f4yAf29Ka7Wm3La4pQ068vgSfz1JmAAB4UvAwAqSxeOwsW7yWBOEitkjsXJnHBWUGAAAEIwAkhN2UEVwha0ZLxwTpWozeZ0EwAgAAghFgIb1BtFlzJ5YE6DhTjJ4LotM/FzkKZxkBAADBCLAIqyewVk7GmuBlBAAABCPAQiyRx21Fu53B7mC0i5cRAAAQjAALsHgZl94BnaOrZNeSugcAABCMABDBGi2tFV+j2JN41yiz1TYAACAYAWChsKvlYbTarlFmAABAMAJAQnxZaCvbXkvcjZXsAgAAghHgKanlCaxld65oBAAAQDACzKTWzSz+rS8a8dgbytGL7Z7qC80MAAAIRoDbgbcOAAAQjABPxnSD92hXft10o3IDAACCEQCujBux22zENgAAIBgBIKBmAu8tlFmErXQAAEAwAixiC1cE1rZNAm8AAEAwAiyglrfOmsC7pveSLWkAAEAwAjwgDaIPAAAQjADbwLq9ezK81pLnMcyfGHoRp0A8jor3GK9f7cbFZxN83yj/BhENAIBgBNgkU6XXWkSVT6cUoV1GfO5BeIXlJL0QAACCEWCTAlCM4soqxDplOUOxND5QG6SEIAIRAGBl/niiz9rMnPSfDeopT0lwtfKxtWv1MA4K4ThdxaJF+Dm74VZ26vONKwlmAAB4EL787e//phaWiysmVYRo7PO2YjubqMUJxinynlOhTKX6P13LPHmfYVzQbmG7NxXEaOOJ9YGhBgCAYITt0y0UGI8kGC9ePbgt5METbr4nbzDU2eVqY7iKJF8wjZ7Yc3bPijY7eYJr9Oy2nh332l5ZXt+uSNlzOSrK6kRtlxChbfA+07W8LOQAABCMZkEjkQmMCWUdTpE6HZ60HnrD6wcROSpf+26wO17tljyPF9HnjXTCbli5DkYR+a4UzJYE40fB8wgAsIhnOMPovCRdIBhH+fCSDAvt+p6YLyuV17fpvEbjdQIePUE2LhS84fs1Xp3M8RSerzb6QCw4W8cnHGfOY+faqk0IRqu91P+NiffoEu/jgkQsicYH5essnwkAABCMN6fzvvxJuRfb9l/OnrPpPDhzUo74Qk08keUEbVhWJ7hO8nm7zy/PYBAgYUSp+4yXYDI/G20evc/XX2228uEdGxaI0j3QRr5vC/1gju3c+4XfD4X+bRkLNeqrlheQHIwAAAjGT5NY6E2UgvjSirmUUAyF2bTQpi8IS0LqLB/nvTrv87vvfa+kxYvqRNzolbP1BKS2fH6dOJHeeIJ4aTkBAAAAwWgSiinxJVeBcjba9IVXmxCfc2y28nHGL2Z3rmDyAxUunn1fPPee7ZLQm+Rja3mQz57MSyCYR6W90IvZRso5yueAEM6VAgAAIBgXcUoIOl9E9aJPPVLy/PmCziLquoLNOZ7PnChrPWHaBsK59z5HbxR64VlN95l80agReW5rOybI/TyBmrohZyQAAACC0SzqcmIxJS6ahMDSiM+cCPXP7klGLJ5XqA9fqE2eeCuJMq349V/3M7AXbi1rvI5TQTj65ewkfX4SoQgAAPCkgnGO+HICzBc3U0FclLayfVFX8gCGwjS3nS2yvlcx9Tv3HrHP6Qs9i3A9FoRopxTZfhl9G2PE7sUTomeGLQAAAIIxFF8lj6KfHkd77i1MKByzeRbbObpGPp8hjNm8dVqZyRNlJ4kHBLXel8bj6LyDTog2kk7h0ijEsW/Pt9UmBK6fXBoPIwAAwJMKxpKoi3mgNClfSmcJfZFiDT7pMkLRt39PzgXh7X53VIoxJwRz9eqL0b5g09X3u7Idwyh1zjMCAABU4utGy3WS9M0TYSDHF6VYPGXEUhvY03oBnVC8ZMShu2nju9w/afXgCcJS3V/k9/x1TcJmr6insSCqHV8SbTAG7dx4ZXXHGEpikXx8AAAAM9iSh1ETfOKLB20i6dR5wpjwGQxlzQVrhCJnS16vIaiXlHj2RbQfUBPDRWd3BfHoBLamrp0Q7b3y5JJha4NtAAAAYKeCsXSmMCbslmxBzxWfFrv9BsViWIelu37dOURN/biziKnE6W1gs1HUj3+2sVe0Sere5AaxCAAAsF/BaPEqOqGj2da9t1hcKwr6FsLRfa5U/ftRyr2kc1hOns0xEHg5L2wpWGkIRHiO1hPq1ht4AAAAYIOC0XmNGqVY7EWXUuWitGkViyVvnF/OPYhFJ6ScFy8U7WFwkdbb6N8mcyoIUZdGRyOwz0rRaPFgAgAAwIYFoyavolXY1bDp7JbO5sWEzdYJvYKhyE4FHJ0CYSgJUTYohXuYSLwUSa1pB98meRsBAAAWco8oaReBqxF2QwWx2MuvbW2tWOxF71lsd9T2U0ToasrvRKOmrs9Sjsp2OFHeFMrcGsR7b+hrAAAAsCHBqIlYFvm8VekLuJCTURScRb9N2RnsarY/t57Wxd0xXRJ4TjSeFJ8pl8pnDGxqPLluG11TTteGJ4Y6AADANgVjE5m435V/O8ivvIVDRCyE79EnBGgoJnr5ld9PKxTfE+IlZVcjQvdwnk67Vd+K3qvqbrgZIjZidf9TIdSd91KUZcXTCAAAsEHBGLtfWcMo+vyKfUEk+ALUenNLDbt7wZ0V1HjwtNvTk6G+StdBhoJdU07XB0neDQAAsAHBGPMsjqIPRtGcL2xE7zHqpXwtnY/F7lEeMwrXbfsOESEZE3eWM6na86NuK7nJ9AFXzu+i20bvBE8jAADAJgTjFJn0NVgEmOVcoTa1in97i8buM0TfngMh1gXi3udkaJdedF7BNmMzFrQjSpuas5cAAABQUTD6AiJ1H3RKgGmEncWb1YveA9iL7q7jR92GTpHyCMaScV+UQmwSvafR0i7aKHVLWQEAABCMlexa8haOytc28uHFcgmfSza1YlHrHXN2n0kwliKnx0jba+1abtg5GWxqvZc9jwAAAID7CMaT6LehU3f/xuglf92cj+WGD+0NLiK2lDyPJhrPCSHWRtrJcmRAW/fu/GGJY6asKZt4GgEAAG4sGHvRbw2GAiwX4KD1AFrEosUT+mxb0bHPfzTUa7Nyvbaybk5Mv6wEwQAAANxIMLrIZQ3unuJSnkWRXx7AUWm3lfLZuEYhUFMi5NnRbiN3hr4wGev2XSnwjmK7EUYTCIMnEgAAEIwLsXhqJrFFLmtF6KB8bydutYJCey7uGbCcETyt3HZW4WZpN03/nWh+AABAMM7HklLFsrWrvUbQ2bXc/JFLERPa7RELn+rDEnneKYSeC6zpDXYtQTDaPtFHyohXEQAAEIwr2OiMwq4XXWJuSzCK1UNl9VoiFn8XjZbFhC/gcuLOktuyV4q5s9iioUO7tD0AACAYVxKMWrE4KifgMOVJaVvRIupi9xS3GRHDVnS8vgdFW7u6PRlsj8a+l1t0+KLR4tXuaWIAAID1BKPlxgzL7SidQbj1SjHgvJYWcYt3MY223t1rtV5dq7jTRmRbPdAnmhgAAGCZYPS3jDUCzIkvzaQdu8kl5cW0iDpLWpbRKFyekdL5wHbm4sL1E0tgTZsoX2j3aPh8vXB+EQAAYJFgtIgvf8LWYLGrjbZ2Ird0Q4xWDD0z2mChWJ/pDYJd+/tW1o2aHmf2RQAAAARjQnxpJ3+tZ+diKIPFrn8uTXu3NZTrZhKb106beilmd/T+bYP/60W/hfw9EIXh937/6I19EgAAAME4Qyw6gaHNuVgrkbbVLoLRJtzHCm0RnlttC4Lf0ienxN+1C/sOAAAAgvFKL+tf+yZiz7moDaCxJP92nw9s4suSDseS4F17J7R1wWFJ6G2N8gYAAHh6wegmZYuw03gXrff5WiNe1077A/MXBtY7obWBNZYzksOMPoSnEQAAEIxKsWgVX8Md7fq217YL8fqzLjxqLA66CnbnBHkBAAA8pWC0TMYuLY12MrZ4b6zbn1ohSmT0MixJzi0CzNouNe0iGgEAAMGYwW1DW7aiB6NtMdheWzw4u2xHz6fmNq/lzKHVy1hD5AIAADylYBSxeQFrCa/RUB6rEIV1RKOWGpH2c/rTVGkMAAAAPJ1g7MV2xlDrtblIPlAhzJF3VIrSrlCGMSJeBgTBYqZIm42Zer8EdZ4729gbynGR3yObm0R5h0z5YiKXiGkAAEAwRpiTH9Fy+0ppgvYn97W8THge6zFk6jn2s7aNp4VtPCkWOK3SLgsLAABAMAb0UueMYWe0WyM59FJRAvH2Hw3i3NJWvbEPNMo2r5WmCQAA4CkEo9W7aDkTZrW7t/Nxz4rVE1wr/6Y13+NYqcwAAAAPLxgtkdGWCX1Oou7JYNsqRmFdagm7WOqecQVhZ/UyWhdSAAAADy0YG4PAsuRetEQwWyNZudnl/lhFeK07xK1itIZdAACAhxaM1juYrROuBav3xyJm8DDWodYRgrPUOc9a89gDAADAwwpG63a0NUdiDSFqncjXjLyG+wjxtvCetQKruF8aAACeXjDmvIuxCXiQz9vRU0YgWvLYWe+N/mn8/Ee6QBXmBL6cjPa1fdMSLX02fs6epgYAgGcWjCLrek+mwqSe+zu2jPfJWLHtLHatnnIAAABQCkbrBGs9U1ZrAm8Nr0GIboutiDprX2ZbGgAAnlYwWkVdrYAXSxRzzUAasDPnfGhjsF3rvKE18AXvJQAAPK1gtIq6Wt66mgEpBLvUp5bn2ZoOyWKbJN4AAAAKwWjdZrN4kmpOrtatQbak62P1PNfyMNbyls/pdwAAAA8hGHMT7LhQeG1F1JGwe5tsRdjVzCkKAADwMILxnoJgrGgbbsvIZwAAAHhMwTgaRZnlOkDLlrTFC2i9m/pM01cj9ORZgkis/aPWWUNrQNSJZgcAgGcTjBZqnCPDU7hvpsT3AAAA8KSC8VbCowQBL7Amo3EBwyIHAAAQjCuJuiWTNjyG+FpT/Ne8B9wahU2kNAAAIBjvBJGqj4FV1N3zFiAAAABQCMaaW7tb2jbmbN3tqOVhrG27Vg5JAACA3QvGJdxzwmSyfhz2dKf0uMFyAwAAVBWMc0QXV/cB7QgAAPBEgtEFEXxRfLXy4VF5v35dROTn9ev9+u/F+9n9jcb2MbDz03uP8P/er+VolWX/4tmJ2Qr/79Y59qxXM9Yuyxrl/nJt02OmnVqv7bWcvb/T9K/JaDtlZ/D6nOMS9CE/72PvfcZcv39Xfvk2U7Zi/f1nwaYEYylXXg2DYUx+MbT90WiXvKsAAAv5Y6HXqA0mmXDS8f+vk19beGel7ZjdnIBplYIgFDZtwlbu9zWZCmWfk25oWlAWl3C98wRdLKl66T2GBZ+7xt/dg1xZR1nvrvUpM0YAAABuJhj9Sc6CdsJy3s428fftDSfCZoZQm/Me4eeYI8okEOidV/ZB5t2hPV1F/nS1dwp+N15ts/X8ONCWAADwidppdcYFArNm/r6tMsqv7cPL9fufV4HWzLTVy4dnz9l0W5NWb9Ygv7yLZ0/Md9f3CO0+ehCStW/eu8/NXVAhHAEAQESWexhLE8oST2DtgJotbc/5n/XoiS63re9E2eT9q93idUcATvKxrdx6AtL3Pmrqfbh+NZ5g9Nv34tnD8wgAAPAA3Dpxt8arNdc7ZRGAW75FxnnyjoEo9D16zgtpqauziHwP7Dqbzp6/ja0RuS4wpI+0sxO5F1nvbB4AAADcgT82WKZpB6LuVvVwlN+DTnxRVjqfGDt76TyEJ/ndO9h6dX+WuBczZdPZaBLl9NsUryMAAMCOuMUZxjH42SoctdQ6NxdGe9emi9TD2RN6YbJo5yHs5fcUQLk6dClp+ki7uK1ll8qoK9h0ZTxmyum2wF0593zOsd1I37SMQwAAgLsKxtYgtlqxbU8OxrJobZ+l7rWGSxgyZT5GxJgTBG4b+N1QD07ofY+87+jVqduy1tZtn6hjv5yjweaj08wQoVOl1wIAAFQRjHMmR5jPWX7fLm4DkXcRuxevl8+Jk9uIGHeJzEuC1G2Tp8rp23SR4AAAAPDAgnGO90IrZCxewNYokKaKtmszSHwrORSAo0GMhdHSObsa0eiXsy/UbS/54BgWGQAAADsXjE4YaLFsSU8zRKOWrW5JW+rmeyAc24TAuxhE3vernaFQzyfPZpOpL7ftXRK4nScamxUWJQAAALAxwWgVda3Bbi2xMFUq861xZxtLYqwX/Ta1i9DuC3XSJ0TjlCin5uzoxRO4AAAA8ECCUbOV6WO5laWWJ7DWTTL3QCPwfEGmFY4az6ATjpr8jYN85IIUhU1EIwAAwAMJRnf3cy0xpKXmTTLtxtvST78zZj6DE2O9QTSmcjL69KJPJq45g+nbJPE3AADAAwhG2A5H0Z0p7QxCzN0+0ytEtbsDuyQcnRDVlBPRCAAAsGPB2ASiQksfCIAmIzCsW8eWK/N6o/29iJaz6Lane/lIlaO1OyjayAnHLtNfXJ/5Ivqt9HchYhoAAGB3gnFaIOzCIIkp8x7DTLuW8mvs7kmsaIJhfIFnEdl95O9TArtR1PdgaONe8DYCAADsSjCG4svqrdOKFItgtEQ0W+3uQag0M4SYH0VdEsh+mhyNXc128iTlfI2+zZMQEAMAALBLwSiiO5M2R4BZPFAiNk+gVTRunSnSJhbR6IR8KZBJ2yYuZ6NGNJ4NNntEIwAAwD4Fo3Vb2uJlrJXAe5pR5r1xFH0wjDbAxHkFLaLxpCxrr/xciEYAAIAdCkbreUPL9rFF2FkjgB8x8CUWYDIYPqM2wbdFNPZiy/+IaAQAAHhAwVhTgI0r2g3P51mvNtyDaJwSbaMReK3U8TSK6G9xQTQCAAA8uGC0UCuqueQla2fa3TtaQe+2kbWeRotdrQfzLDavKKIRAABgJ4LRTfRri0Z3/Z3WyzgqBI4voo6G8u45rUspynkMxJ3l9pbvyjJYPJhHZdtYtrwBAGB/NMH3e3re7z4dXC3BaNk+tpxjdIJHa7er2Gn33vipNEhtQohpqeFpHMW25U2eRoDfn1kspmDvTMH3e9odHPZe+V8rNqrFy6hJu2IVJE7R1zgj6bZr94zzqq59jeBRbNvIlnOSvaFtmBwB9ju5riGQY2KZxeTjcJKPM/HuexZpOxSMVmFXKyejxa42wnucYXvLk8ja4s7aRr1S4FkWIWxPAzwv7sKAn9d//a+O58LuFwLdtW17+cgf3Mu2AlKba38bvX748/q1W4fGH5XtD6LfbvYTRmvsdkrbVrv9zFXsXhmN7TMq6nLy6lEzgN1rz8rytorfu/J+F4DnmlBTY3Iv5V9aVn9uaIOFpHvOT3SV3To5cnP/yWvje9IGffAh+uHXyvatAqwXW1RuDbt9QUS1wYPpEbyMvWEQdDI/cnrMCFWt3dKW9xQpL8AzTaixrz2V/1aLYNgnbcFZsHVHzig7PSLy9QaD/yw2L5a2wWudZay15b1lrDkPrXU5Zlb7/s8XZZ/KifousuJENMKjQ1DLPEFJne2LnGOh3Umfm/a6qKklGK0PrzkD2KrQ2xXt+gEyjyJGBoMgt6ziNAJ8NNq1tL32LmuAPYtFd5br/frlzk3t7byU+yyn62cIP8+az3rYt9jPzQ9bI7YzubvFSs0oab/RSvkT/crsDZN7L/ltzvBBdIn8X6pTDoXy+mX++QAr1SnSqdvMKq832B0M7T8q67KP9KuhIHCbmQsa2IaQaKiDaB1MkcVr643hKfG8W7NO17I1XcViL7/vSFgyXljeD/Y1T+X0RG7uzj3/136+lGyVzi82M2zuVjCmRINFjTczBnyrsNkoHhbOZTway/wIg9HqCZizgCihTbUTBuA0BZvdzPLANvrmRB2Y62DMjO8165T2gVviOyFG7+uomN+mymOh1lx89/J9vXED9wbB0EeEQxOpwF7qnDm0nmV8FA/I0fCZT5Xq05KfcTAsGLrEyhJgzzSS3w1o6O/wYAuns/zKgNFe56zv169pR5/hHs+J3QhGazLvJdG4a4qRGnkK97JyW1uA9xuw2wvAc0+2exfH8HuduK/uzs6Lpe/dVGj/R3DmrPEZFo/9r3f44FZxp7VpvTJwbTH6SClchhUHeFifY4UBskTYs42GWHjkutnbVnHOW1pzvO65b/npk4Y7t/nS956Mv5+Uf7P35/wmPsMfd3jPXvRJt92251nRmQaDyHSv0Wy/Dt7DpFWUtxNdcuutC8a5baQVo9q6PCsH02AQ7J08wL2eTyaGwv44zlgs5p4F4RgfJX5OtoY4aiLvOyjEjR/s0hbqboi8b+mz+eXLLQCnldv5Xv3L1aX7XGslVu4iQnhO/7ImNY/1r6NxPIScN/ZcmAzPdn/clMZAqu/X6POTpxv6lZ8/4edolzw/7yEY3cNQ65Hr5WMrsSQYR8UK1e9YWuHgyqux68TTngWjOz6gTWPRGx4mlrrsRR8wNRhEo7s67CiwB5EYG9Od10f8yd3qae4yv/fFm/bB/Z7pn703WXUJoefet8u8b/js7AoLL3dFWRssgI8KkVF6no7e2JtmtrO/6zPNrN/eKGZ8kegv9Fvv5977bMOC/tut0L/81EmpZ194bW3pfWNiqvTMbwtiuim8/xJH0/lqvy/Y9i938O8Q7+X3nMCDNw46Rb/322wNp0MX/NtGxvR4/ezDjP6XWkzOen7eQzDKjAdLp3wg+W7bVlmp2vKOygHQ7tyD1SQ6TulKvrZCXYqxLmstGOD2WFI3td5ENiaeMf6E2Brt+pPsnEXG6InFk2KxHBMtU0LsaMdoWxCXTeB5EGMdtTMn0darE4l44Vpl/VqzcIiyf1muRPXrsiRq5vSvtrBYlkL/GjNi8eKNodx7+QutmIjx5+BG1ske4rdvbDcpJgJTWqON2Pa/vxTK0Qb1tJZg1ARsiqKf/5TyTTi552fW/j3OMPqrAEvFa1csx4TYSa1atKLxbOj899paWVvMWwZFrTNAfrs3ijaaCgP+FmWGZVxkXnBSK5+3dcKxPsr8Ccw9tHOJsHM3UFy8z2V5Nlhe384c66cFde6P04uyrI1R5K752cfr5z0ZbLTe32n6bqkexkL/SrVVl3mONQqh2iaE4kXS9x5LoU+fjOLEKhA140xT5jYzvlz/L6XSC/NFz82/PFzf891Q32585TIevBfEoqZN33P9/J6CUcS2hWQRYeFKty0M8M7Y2NpV896DYLR1KAXvRcyuVYxqz++MhofGHu4dfTbWuJmk5rVb2ge8JPpablIaDf1WVq4j7RGhUTFWLYvSaYV2s8wjbaINNV7KVvGM0njVYu89Gtq2TbRdZ6z72PNvzJQt169LjofR2Bc1+ZLXHNPNjLE191lg2T3JzbFTpbK2WxWMzivUKz9Ep1zlOde+xtPYRpR7ya62vHu7lqskvEdF+2gf8JY7xntDZ3/GVEiPhKWtU5PPNHOht/bCVStWSg/q8D2tgrP0Xpax2K48proVhPAaKUc0zy/NxQDtgn7h22mMdagRIWOkT4X9sY08q0tnK/tIeTuDWGkL/7dW8FHuM8zte7eePzqlg6fKM24LgtEXjZqHVq8UjRKx2a7U8JZUO/2ORaP1hh7Lg876ELCI0XHDAx7mTci+mGy9hdsYeZYMicky9f+9fByR0QqLZoaYWsMD4vfxUfl8i3l4RuUzzdWPq6Mawms0CN7YZ7lVgGFuR6Ik2AavDo+F+W7OQjbltRwlHqSieQ8/mGYstHebEajWW9PmzLVL2zX2rBiUzyzL/D4m3mtcoQ/2meeeG8OD6K7qjfaNewW9pESjtuJ60UVO+x7B0uDovIlII0rO8vmwdkmQ9LLPyGmt4PY/77kwwCbvYaB9MDbGh4wlLRDBL9tnCPrVFGnrJtOO4WH5VPTrF/nYySh5RaaZ48l/X/8cYa+c1MKI2FxZw+jsSXSRz6nUMr1CFJaOkEwRUeJe/16ov+8rPteGyLOqdEQp1u6lZ82QeP5PibbrVhovk8S3ukte8j5SL+7n98xzf8i0a+z57wfbuDZpI210q3nTRSOP3jgR0QWoWfJAh+83BP2vmfnsmSLjN5Wap5QlIjqGtyQY/Ye6xkWszaXoRKMmeqgV/Vm5wWvgnE1/MO1RME7e6kRDJ3nPZOxsy9r5Hv3UTdoyIxjvTzuzf1pygPZS9pw7QZaLqG4U3gON8A3Lpl0wTYHoKNVR+O8UEQS+wJgyC/uSsLJOouFk11buZ7k0JaUMDrFnRafsc7Hfpea6pjCnlPpYON9MSoE7KMZGZ1jQT5mfS9vha6WumdsnJm9MNhX6ZawP9ooFSKN8hpbSEDaiD5ASke1sSfscRX+mRnumUQo220Dha88e5h7yYYWfDGXdGpYcUJZAEuuWd294bY3rIqEuTeF3awSSaftyu/D3qUlpML5+SZ2J2I/aaG+UGHfcz0Ih4p8bLD03uoQnplSn1ufU3P51lPJu1pJzcGtsEfvR2daF1a36xNw5SttOfeb9lt6Uo7Ex65jc1w0PaG2l9UohNohuO8NtdWsHrCVop5f9MvdAvaZdakxO1oFHtPS28c8DdxXb6+ItGltjXyyldAr75BqRoKUyrjnZOdG+NAXP1sToEIjludGnY0GENAufl9qdr1KQSq6uNQJ36TM0PNIwbqAP3HL3r1U8K2p9frfobo3Pt2bLglFEfwjdF42N0q6mMWI5plI5kLSiUaSQ5+hBsHjsNCs4vx/8XChGxxU8MVAHzc5CLx850y4L280JoJ/Xcfku5WjXJVtFQ2GSCjMStIr3HRYu2HJj+OLVy7vnGbHmWlxDBK8tEOeWfUw8N2LbxV2k/t4j/yfKZ1JJZH2fUb9tZH4qfeWSPzfKvpVr71t7FzV9oq3U11Nz4twA3SaiU96D51suV2i42/rpWbVlwegKeVSuknvRXWXnOuOg7NipvEexM0CWM3N7EyjWFRgeO5grGgflitsdSXEPv0bZLztPdPZ38mhsebF3ks83nMDj0FbuO5PiNaUtcc6TLxebF/l923/x+eAtC8bG60Ba0ajNfehs9kp7J0Nj9YqHbCpL/rOKLOt2d2OwOyofmJY8klB3pR+OoVbRbqfIqjm22u4jr5ubgPfR8LebO+pFJbgQ1Pq6aKTs1OkRjCqdkdJL/lnvbu3x+3VHlWJJuaP1Nmg8je7slCW45rvSS9LL/Mzt93gYWO9rtd7VvfYq2Xoe6SSwlbF/ntEnwhyJU0Qsdsp+/mxCoJTW59nrZyuLqaXcyynRKPrXXjOJbGUh4+4kL11x6era3J++7mywfFc+1GJehBTHCjZjdlOr9b1cIWgVddZkprUCVGqJXKg/3l2SY2vy+HARFhOLMdHjUmv0MwTro4tFP8F5L3iBrIvt0fh62Vn/G43jMja/9nSV2fOf9gaqs3xO4m3ijx1WlvMKlrwFbjtZI0bOXqctNVRXECJ+ni6NXVfOtVaQtUWjRXxpc7E5MdoZbK9xt3Sq/c4CW+lvYW7Wy4w2jE1WXWSBF+ZgW31LZ4OUJvJUgutS3shnIxVxGu5iNQo77lk4FfpsjWd4H3EOhMmmw6jwtjDPlsTMPYJcHnEcp9pJPIE4zZzPdysY3Qc9iu52hIvEE5nOEaKhl1Aj8FxC3NxtDE40dp7nY4uueav4aoxtWsuu5bAvgnHb4vEon+/BTY0nf+E2N7Hys3ibW8VzUfNs4Lxj+Zk5Kfq53PEZFJsnrT/HRGjpJhxYdwyHYnGV/vR155Wk2YdvRZ8Kwk1IpdQ7LsoyFmAzJMr5XcrX/VQ5qLrypL3WRLTlgce29LbH/FniW8b+1l/nib5UnrxR9Fd2PsP2dLh1SsTq8mdJt3L71LaxdgYPjQeb87D15tVxzcXH3gWjE3hfpByd3MtHHiJNFPV3hXDsxXaucZJ8Au9RPudJ2qJw6Q2vtVzMbj1raCnHUHFAwjKayM9dZpw23lgZjO3WGsoSHnlog8mt9iRn6YNTZgJ2UZOpz3sK3rMttI/7v77SmBkKk9/WznuXRHWtBejc+p4ibTcGz/e16tjNZbm6O8r2A12ajdvsZr6XOchzr1vSqc43SfmM00k+zkVpr0HqJH8FoItO0p7Xc9vU4eordkH8JNvaop4eeBDfwjbk+5M/YaXud031Q39bdCj83h+7Z89mI5+9/alJ+hb3HbeG13aFcsXO/FrvXA8FvdygDvzP1CYWGLd8Jo0JAdZlJvNG8lv7/hGLXvQe73alMRdLOH7KzD3+lby584elPhLGAzSZsm71mNYeF+hTQdM8hWB0Z5zazAPfX0U3yo44eQMitV3ceQ1xNK5Mu8zk1HqelGmng6atWGbtZGE9xwj34RRZQF3kc0SzEzixM8FtZmJP0QcTUyeft7H3KLpjddIGAkxzrruLCLfadVMKpum9hXQTPEunG9d14807fVDuMaj7iyeMwoCSsE77yp/Fn3tSIrQP5sfB+/0p+Gyx27q02T9S4y0MrjkjGLPtmRv/F0/DNLLA6/3HA1aeH1l5yog81/EH0V1P585NnRKDvPVsWi4sHzxRmNvqGRSTwy1W27WSbFtXzZYobOv2IcLy9rgVb+qKtS6YyErtPUUWC21BNN5idV9bAIwJIR2ep+sCEZlrl1tuA0/eZ2kLYz8cr7cIFBkNoj1siy74NyfSj5U/RywgLHflX2fo11bv1dKjJFCuv4vX7t3ceffrg1fUWT7yho2J1V0vH7e5WPIYpbYYfHuWxNWDZzt2NktTzmmjnXWNldIaiwjLxM6tL7elWWly6L3Fl9xQSGj7Ya1Fyzjj7/zIc2djTr7AW3pMSguE2gIjddHCEIi8dkEbNopFRrtCHS8Jasqde1xjYZS7UefZBeSoHDOx8dwtGcNfn6By3Zayi1KOJez1BZkmiMUJvN6boGJCdBSRn0bx4UTuUSEcmzvVZ60E3jXvq67pGYXbiqnS+BkSk+Mjo/2MY2T8jFL2wt5KLDrbg+F9w/Fas2yl9DBtZvLW2p5u3GeGleuhdr0TVT1//McWWuq2/OPJKtUPdunk963l8HzjoLB3Dmx0EZtO3FnO2YRb1V1QRj/X3NauVArP78SE3rTCJDQ3khS2+cDzo9+tZ+XCbegQt4DrjQ/fW2/JxsaQtn/3inoLt0jPYg9+GeSzF3dt8eDn2Q23plPv1VV+Drr2GJXtMAZl19ZRL7rkymudyR6CBUM3Y8ztNTXOkjq0BqWt+T5Tph07xVhxr+8lfrzOvef0CIJx6Tm9WGLUU2RwX64Vpwn797c8w4mm8wReLx+peibF55uC8vrRdKHdXmxnJ7cq6LcC52bu0/5Hb/ycJH/LhH++96iw7byPF8mfZzxnxmWjEA6pcmomVf9h3RonnHABa93ZcHUT6/+jlLNLTN57rjGWz5HxmKqLIbFgmDNZT14b5ybr1Fzk2uEsuh2r0bDwX9I/NP1GlP0mNjf69TEm2i5Wh345YouQcAdvafsuFZlL/q5duQyhXvgi6dgNP3DwHKnz4jz85W9///cthF0z8yGiFYfNig+pVNTy0jMf4dVmfvTzUpv+v7eIqE49BMdEJ7Xk2no3rLhG+XXUQNNfNPflhu19DOrZ1em74jP7DwfNfciWfJ45YRMbDz+Nq+FjZuzeOo2JSD7dxlo2H9UD3QQT92B8tohsKztDFxlne2q7bkdlrzHu4L5tuKj9anoYpxUKOa38Oq1QGCS9tdMseN/xugJYy2YsmOMWE7rlILYlmllDm/m8U6U+EtazH2nWKst4S6YV63eqONasn2fNvv0sE98az94t1dXez6IOT9B34EHb8NZb0s0GOqEld99UmPgtn2e6UaPeKhdZmNfNXzWHwmOOYNJExU0FMRq2j2b7wn9NZ3zA5+w3hXLmbPn1PCbqdkq8R1Oo2zXGUnOjvscEdtv6o74B4P8TbknH8gCWVkvaCdVtCZZe7yYhi+2LYdLyt4LvJVj3/jBuIoLRtVssya/Fg9ok2j72Hv7RgUlZ5qPh86UEWOoM1THzmlTC1CnyN26chJ/ZbSn6QjZMsxQTcOHNKTnB6G9b+jc6+J/TnVVrAqF6FAAAeBrBaPE+aA6b+6LOGoH1XTm55w6xx+xu9f7KRh5vVR8LXij1qV5ZD9ZziZY+1Rv6a6lPWfpo7Dq8tcaV9vPPGVci8eMWAADwAHxNeDssAke73dgbbVu2emsmxL0lj7gFNMzoUzXacjSUZU47rHVbQc0ckO3C+i1FBgMAwJMIxi0LnIbJapdY8+mFC4BG2Sc0fWDJrQbWZOVNxUXKEkFpFdmlvx0rfUYAAHggwVgSjUsmzVqeptL7cMPHuliTHg+G/mXJb7ekT5RuwAhvv7GI3q0u1LSee4QiAMCTCkbL5Gu5BWHppJ6bvHqxX/2Wsktk4PqCa4lg1LZnq+hzU6XPUMpTdzZ+LovIPhrH2GlmW4yKOuD+bQCAJxKMAGvSPkGZ773I4EgGAADcXDDWzAk41wu4Nmw7b5Nx5TZsF/Tr9o6frd1IHx0N9dEyrgAAnkswDhUmbjdhW7cbO4PtR4mUfgTmnt+r2YY1+rSzO6782ayfbzL8TVupPRhXAABPJhit94bWnICsE7fFLt6Q21BLRFjb7959etxI369tGwAAnkQw1szFaPUw1hIbreANuQVWUVfryMKctDhri1GrsOxWfv+5TBXrDQAAdiwYrRN3bcFh2fKuKWZgnjDX9imrZ9u61T0Z7FrLXUMQ36pd9mAXAAA2KhitkwQTBcD9xFdNIcqWNAAAJAXjILbt47XORI0LxKh1YiNnXH1OBQE0Rvqdtu0sgqpf0D9z1+MN8ivHohbNPc7tjD46GT/jSeodIzmt9JwAAIAdCEYrlpQag3KytE4yk+AN2Rtz0940GynzHMadfM65ZS7diAMAAA8kGK3iy+LxsabtsWDxhpA3ri7WO6Rr9QnL2ciaQTpzRFNb0W4t24wpAIAnEoxzRKPFE1hr0txKFDbUuy3FKkQtfa2rVOa5IrMzjKux4ni12GYhBgDwZIJxqDjZ1rqveo5nFNanMdat5cysVZAMGyhz+Hc10gdZE+NbxGjNZwEAAOxcMFqFnWUir5kCxxqsgzdkfdqKbWY5/mD1jN1iC93qYa+Vj9HyeSfZzrWeAACwQcFY82qwWhOQxYNDSqC6onFtUWddPFjzL1r67pIAjloe9po3vljPMeJlBAB4IsFonZSsE9AWzkjC+tS8tm8rLAnSmRS2xwX1uYXFAp57AIAnEoyDiBwjk0GKXjlRDJLOGzdGvrd4WazgCbldnY4LxeJJ6gRBdWLLY3hOlNtyJrAvCK42GFeafjpFxqsUxuvJIJAHxhUAAIIxN1HUOqQ/Gf6+VrQ05xjrMhbacKjQt6z9dq10OhbxO1Ws75p3cotxbAEAwJMIxtrRlzWEnTXqFm/IepS8gOPMdrJ6mbWRvU0lu2v2Ucu4so5Xi8C1invGFQDAEwlGN7lpvQtrRrG2wfe9cUJOCZUlIhfK7T+3jUrCTgz9qtY1g2uKMevnt6SXqmWXtFUAAAjG7ERRIxVITe9l6U7g8HdMbuuIxbZQ761SxM8VNU6I1fIurikYrWl/ugrlbGfUAUm8AQAQjNmJwiIcLJNbDa/FnC00JrflgnFtUZcSojkRNtzZrmygj9YcryTxBgBAMGYnCsskpI2+rOll7KXeGTlYJjq00byN2I8iaAVNW7H/azkbF0x9pfJuYVcAAAAeQDCK1POG1Lyhwi+z5cwk1KNWZLSlL1mj46eN1EetRN61sgUwpgAAnlQwWia3i8Fub7R7Kkx+scm4JDY70XtG4YOToa01gshvx4tBEPXK/unsasVML3W8i46z1AkAOhvGVWsQmBYPsRuveBkBAJ5IMLrJs8aZQ+tZxtxkPxWExVy7sLzOSouOwdB32pmLGYuXeuk1gGJ4nxrBJNaydxXKy7gCANg5//Gf//Xf1r95u351weTxEnnti/f7txl2S/xQ2HW2m0QZYxMb1wvqaUTkH8q6FfnlmXpT2u0TdsP+NorIn6KPjD5cvzSiyOr9m4urk4Oyj74ox5Ubh62hPX8ox+s3ZXn9sr4xZAAAnkMw+l6Lgzd5vBQmN+2ke1CKjxeD3ckwuTkGuoeKfxnq1QmwpXbD/vaXiPyv0a6mj/11/boFbyLyel0waRc27m80QrQxjCuNXWdbW5ffrv++MmQAAJ5HMEowuZUmDK3Xznktvsn63sA3+eWFskzgeBnzWO5gdmlpXlewG/aNP0XvubqI3htqsbsWlv7/Jjovo3XB9E3qeBm/3VCAAwDAnQVj400k1i1k7da0yPrewDdvMixNxpat9GemF/1W51/XdnpT9K8/DXYHpQhx0cWHle2ujXVr2uIN1G5N1/IyvgjHPQAAnkYw+hP+ZJzcDopJ+M04CVm8jK+i9+BYJuNnxOpdPCvb6F9SJ59jL3oPcy8i/7xTvVr7/zfRecOdN1JbBwfR7wpYF46CaAQA2BdfV7BhSTysje60eiGs+fSmgrjxywv169y312XaIyYYtWW1lPfe51ct/d9d7acdVzXa2BIxTYJ8AIAnFYxONGrR5uvrpc4tLUNBkLTBhMnkFm/DXvnao+i8gJPEc2C2mXbUiBSXI1Ir/r/INrxf2npz/V/bHq1BkPfK8Tpdy2oRjeQ7BQDYEUuCXkIs56NahRi0RHe+eK/VbCEP8pGL76Vg153ZZAvtszjXbJeO8usIwpvS7r+UZXB2S23dXIXMwbCY2Fp0/EH0QTrfFHXiXuPGlcb2D1k3AMa9nkwEAABPJhj9aE3NhOGEZWlys0R3tmKLwgxvl8nlktTmpnsGeoMoyKW7aYJFwb8Mwkib7uYfso9zi7lx9RaMmdziRhPd7BY/P4K6yfV/bc5HS1ogJ17JzQgA8ESC0U1Er6LfGtOKuzeDELVGYU7yseVc8jQ+ewCMS3itFQS95I8q+CLBksuxF1209UlsntDzRoXL5NW/xtP+Evxdrv79G29eCosxS9S0VuAeGFcAAM8nGB2D6LanX64TemkbzU0o2uvcnADUTEKWKO9votvyeySB6Auof4jeCziI3lvnn78bC/ZHEfkfhbDrDGV1YnHL7Wr1tLs20LSTpf9rjmZMwThca+EIAAAPJhjfDBOG8zLEPEZN4v+WpBqJ2dRuo+XK+oiEn9EJsFFRV2EKnSZTZ34i7dSNQe7M4v+KznvcB4uLXJn/Kfs4S+c87dqUULlFk98e2l2Bl4goXGMh9mJY4AEAwAMJRjdhTMHkVZo0wjNSbxGbfxnEXSxYJSVafog+aOcgzxUE4+6KPhZEneMYEWBvCbv/F9R5yu6r6INc/i8iVGJ2B7ndPdFrCUZLHtHDtW5jZw9jY0uzGGtFHwT2arB7QDQCAGybrxVtDwrPhUvD4W9LNgq7mvQdrehTd0yiT2FiyXv3CPRBO7aFthkMdttIX0j1E00eR9/mmOlvo9jSNm0JbQJ0N666Qp01nnjOjdFQNOZszukP5DwFAHhSwegLsVExSXQi8lMxGZ5Fn/OtlV9bnlpx98UwEfcRu48mInPCeIwIQK3oPkWETEzoDdc20eT57AObbaI/DEbRtUWOog8u6yWdS9HfCRgS/b/N2Iz1/2nmIqITkXceyQAA26TWlnQM7R3OqW00H3eeS3um0XpzjPac2EswGT7S2cbS3csvgXjURBm7LeNjRHy+ROwelTb/Ibp8he4s5CPcEW7Z8nV9WpvC5pvoU+O8Fvq/JZ9qOL4BAOCJBKP17FVMiKVE4A+FULDmUXw1iFFtPsk9isWT6IIWBvmVz0+7ZXwoiE9fLGrq9V/X93/JiFBf1O49aMkPWNFGT7uArYOUI5K1/f9F9JkDJtGn2zkoxz8AADyYYPSFo+VwvdbT+EPKASsv8pGkWJtuRysaDw8mGkuexVAs9qLz3v5LdJHz/bWtNAEuucTcKbG4d2JR/iK2iOSSB0/b/51o1KbbGUUXXPaoCzEAAASjQTBqBJ6bNA6iu7nCv+qvJO40QlSk7MH0PVgWu1vnohQfvfxKSaPZMtaKxUFp0+VZPCptagTonnkVfVYC15/X9uC/JQRtbKxqBO4jjSkAAARjQiCUJo2cpyE8z6a9lkx7NWFpyzuc/FKellevjBq7WydMn6MRdho0YnG82tMEt1g8oFpRu9f2egsE3ii6s5w5D562/8dEoyiFuTYRf2sY/wAAsDPB+KZ8jZsEwnONL5FJ4yDlbS//irHSWcnclncq/2PowWkTZfUn2j2Jj17K9y67oJG/ZD3PomW7WHu20gnQR75BJBVg8kN0Cb4PXn+dZvT/mGh0Zxo1/d+6wEM0AgA8mGBMeUBSAi91aD8WOasRFa+i20qzeBrdxNkoJ+K93Y97EF3OTJeSRiMWe6VYHEQXkNTJ51thcvwlz3vdnOt7B9GfFYyJsVT/zwk8y/3QTlRqdhpa+bztDgAAN+bL3/7+7y2Uo5GPrcbSJNfL71uXfv43//tTIIRGSeeVOxvKqhFDFpv3rPdLUCd9RDyWPktY55p2TAXMdBER78SiZNrykQJb1h5XveK1rUGQXSr0f41NEX2uVAAAWJFbBr1ovA1T4K2IcZDft9JSVwqGwQApm7mttCZiX3Nw3/ecbtEzcrp+jpdI/foi7C8pp6Jx59z+cRUKLwWheJbfPZXOe/vq/fwP+UibE/IS2Hz0wJa54+pFMabkWn+d6Dyzg9fHc+O0E9sW9atCNLqbZkrnLwEA4AEFo3iC0RcnbWbS6DxRmGNSCDx3/qqT37dH3xITkROjXWTic8E6lnLeWiz2hdf0V1H3v8pJOBR2sTyIr1e7r5lFg0MjPl05HzWwZQ1cMIwfFCOZceD/m6tTd/Qjl/HAbVHnziA2wYJxUoz9g8ST8dMHAACeQDCGk5woPCOHhBhrPM+GBK/JiUY3wYXJiN8y5TzL54jPWFn9pOX39DambloJBa8LGHmLTOyheHbbxYdMm7ntYs35x877Knkqj1dBC7rFmCb9zuFa96kzg2EUtTallVs8DQWRN0k6IC41xhGKAABPKhhDz4hmgvshv6cDiXlFnN3UZOREoyUH3CD5pOQvXjmnO3lDTleBdSiIxe8JoRDLs6cJREltF8e8tu5GnkPBZi94FZeMq1R/HbxxlhJkb4l+81YYU76oLIk8FzTzlhmr/u01msThAADwoIJRIhNBbutLewZr8iajnM1WPq68K3lanN2/gkk1Nnk6z5kmMnUNXHqbPyXvBTqKPreiE4p/FsTnXxlh9xYRtJqAlWOkjTm7Nk84huK8jQgyzQ1JTuBp+r9F5Lmx+q0gRl2QVSOcYwUAeErB6E8c7gycEwepyUPjwQht5s52uckoFHgp+69SPofpB+BMCptzhaI7B3hICDpXVu1VfIdr2U8Z8TnIR2CLZrvYRfFqxOdfCVGJWJy/IHM5FhtvIRMLhIrlbEz1/1HyAWxO5GnHqjsv+SppL75/tpE+AQDwpIJRPI+EO1vXBYLCv6bvz8QEF4t49s92lSYjy5mp0lksd6ark/W31PxE3C+Z+vxTdEEtLv2O8+K+FESdNlDmJL+8n60nNtuIvX8KefhqL8icdzB1vrXNLJ5S42q8/uz3/3CsviiFqH+16GtmMdYZbAIAgJKt5GFcIoxK+RsH70tr0xdzMWHk7E2Rv01NUs7WJWHzuNIEd8mUexLd1X9huVMexVhdNIXJuvParU201zijfuH246qPLMimwrhK9SVna1ipnHPyctK/AAAeVDCGk1FOkGkmjyYyAfrno9qIWDobyzkVJs85E2fnCbE2IhIHsSe0TiXg9kXCaJhgXdkuid87Wz2T9qbGlP+vyLJk6X7/7wr9a5hZ1j6xqDnTpAAACMaUgOpW8mSIJ8jCCSnnEdNOdn5Z/e3ZnNDzJ0l/4vVz7s0pkxOxXWTSnWMv1xZL7MLtx1RTWDxZ29H35oc2rTsDYVlPEXujZ4/+BgCAYPxtUuojgiU1IWm3pULvo5uEjgvLewqEoy8Ap8hEK8HrhkKZp4zwdJPtlHjfOSI49CBpgydgm2NJ5HfPY0yYze07p+A9lix+YmUcvf43eq+lPwIAPLlgjHkfmshE4Sa3peeY1j4HVftcVWzC14iG0lnNJpiYmZAfX0z6i5hxhbZ3Nuk/AAAIxrtPclYPQ2N8/TPWKXVDWzKWAAAeiK9P/vknSSfmtojNWiLW8vumYpmsdZoqX8eQ29340PRXa99rPDE63WhcAQDAAp7dw5iazG7hVREhbQwAAADsgD+ogt+Y7mgfsQgAAACb4/8BLtrJ+pXg97YAAAAASUVORK5CYII=";
/* ---------------------------------------------------------------------- */
/* CONFIG — Login / Avaliador fixo / Servidor de acessos                   */
/* ---------------------------------------------------------------------- */
// Senha ÚNICA antiga: só vale enquanto NUCLEO_API_URL estiver vazio (servidor de acessos ainda não implantado).
const LOGIN_PASSWORD = "STO@2027";
const AVALIADOR_FIXO = { codigo: "10003993", nome: "FABIO NYCKOLAS FIGUEIREDO BOTERO" };
// URL do Apps Script (termina em /exec) — veja apps_script_nucleo.gs. Com ela preenchida o login passa a ser
// matrícula + senha, lido da planilha "Logins e Permissões", e as abas liberadas dependem da matrícula.
const NUCLEO_API_URL = "https://script.google.com/macros/s/AKfycbxN4AKCD3t0yre9iwiXPrEGa_kfLiH4VopEbtglv2Wsb6AKbEabjG2CsZTdLCClXpZc9A/exec";
const AUTH_KEY = "nucleo_auth_v1";

function normPerm(s){ return String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]/g,""); }

// Categorias do menu (o nome em "aba" é o mesmo que vai na coluna Aba da planilha de permissões)
const NAV_VIEWS = [
  { id:"indicadores", aba:"Indicadores",   icon:"📊" },
  { id:"gestao",      aba:"Gestão",        icon:"🧭" },
  { id:"lancamentos", aba:"Lançamentos",   icon:"✍️" },
  { id:"admin",       aba:"Administração", icon:"⚙️" }
];

/* ---------------------------------------------------------------------- */
/* MODULE: Auth (sessão, permissões por aba / sub aba)                     */
/* ---------------------------------------------------------------------- */
const Auth = {
  user: null,     // { matricula, nome, token, perms:[{aba,sub}], legacy }
  _set: null,
  setUser(u){
    this.user = u;
    this._set = new Set((u.perms||[]).map(p=>normPerm(p.aba)+"|"+normPerm(p.sub)));
  },
  save(){ try{ if(this.user && !this.user.legacy) localStorage.setItem(AUTH_KEY, JSON.stringify(this.user)); }catch(e){} },
  load(){ try{ const j = JSON.parse(localStorage.getItem(AUTH_KEY)||"null"); if(j && j.matricula && j.token) return j; }catch(e){} return null; },
  clear(){ try{ localStorage.removeItem(AUTH_KEY); }catch(e){} this.user = null; this._set = null; },
  logout(){ this.clear(); location.reload(); },
  // tem acesso a esta sub aba? (view = "indicadores" | "gestao" | "admin"; paneId = id do painel)
  can(view, paneId){
    if(!this.user) return false;
    if(this.user.legacy) return (view!=="admin" && view!=="lancamentos") || paneId==="links"; // sem servidor: tudo, exceto o que grava (Bases/Acessos)
    const v = NAV_VIEWS.find(x=>x.id===view);
    const it = ((typeof UI!=="undefined" && UI.subnavConfig[view])||[]).find(i=>i.id===paneId);
    if(!v || !it) return false;
    // nomes antigos das abas (aliases) continuam valendo para quem já tinha acesso
    return [it.label].concat(it.aliases||[]).some(n=> this._set.has(normPerm(v.aba)+"|"+normPerm(n)));
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Api (conversa com o Apps Script — login, acessos, bases)        */
/* ---------------------------------------------------------------------- */
const Api = {
  configured(){ return !!NUCLEO_API_URL; },
  // text/plain evita a pré-checagem CORS (o Apps Script não responde a OPTIONS)
  async call(payload){
    if(!NUCLEO_API_URL) throw new Error("O servidor de acessos (Apps Script) ainda não foi configurado no site.");
    const body = Object.assign({}, payload, (Auth.user && Auth.user.token) ? { token:Auth.user.token } : {});
    let res;
    try{
      res = await fetch(NUCLEO_API_URL, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body:JSON.stringify(body) });
    }catch(e){ throw new Error("Sem conexão com o servidor de acessos."); }
    let j;
    try{ j = await res.json(); }catch(e){ throw new Error("Resposta inválida do servidor de acessos (HTTP "+res.status+")."); }
    if(j && j.login && payload.acao!=="login"){ Auth.clear(); LoginModule.mostrar(j.erro||"Sua sessão expirou. Entre novamente."); }
    return j;
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Nav (menu lateral no computador / barra inferior no celular)    */
/* ---------------------------------------------------------------------- */
const Nav = {
  items(view){ return UI.itemsFor(view); },
  views(){ return NAV_VIEWS.filter(v=>this.items(v.id).length); },
  firstView(){ const v = this.views()[0]; return v ? v.id : null; },

  render(){ UI.garantirViewPermitida(); UI.buildSubnav(); this.renderSidebar(); this.renderBottom(); this.renderDrawer(); this.renderUser(); this.renderAtalhosVazio(); this.sync(); },

  renderSidebar(){
    const box = document.getElementById("sb-groups"); if(!box) return;
    box.innerHTML = this.views().map(v=>`
      <div class="sb-group${UI.currentView===v.id?' open':''}" data-view="${v.id}">
        <button type="button" class="sb-group-btn" data-toggle="${v.id}" title="${escapeHtml(v.aba)}"><span class="sb-ic">${Icons.forNav(v.id)}</span><span class="sb-gl">${escapeHtml(v.aba)}</span><span class="sb-caret">${Icons.svg("caret")}</span></button>
        <div class="sb-items"><div class="sb-items-in">${this.items(v.id).map(it=>`<button type="button" class="sb-item" data-view="${v.id}" data-pane="${it.id}"><span class="sb-ii">${Icons.forNav(it.id)}</span><span class="sb-il">${escapeHtml(it.label)}</span></button>`).join("")}</div></div>
      </div>`).join("");
    box.querySelectorAll("[data-toggle]").forEach(b=> b.addEventListener("click", ()=> b.parentElement.classList.toggle("open")));
    box.querySelectorAll(".sb-item").forEach(b=> b.addEventListener("click", ()=> UI.goTo(b.dataset.view, b.dataset.pane)));
  },

  renderBottom(){
    const bar = document.getElementById("main-nav"); if(!bar) return;
    bar.innerHTML = this.views().map(v=>`<button type="button" class="nav-btn" data-view="${v.id}"><span class="nb-ic">${Icons.forNav(v.id)}</span><span class="nb-tx">${escapeHtml(v.aba)}</span></button>`).join("") +
      `<button type="button" class="nav-btn nav-menu" id="nav-menu-btn"><span class="nb-ic">${Icons.svg("user")}</span><span class="nb-tx">Conta</span></button>`;
    bar.querySelectorAll(".nav-btn[data-view]").forEach(b=> b.addEventListener("click", ()=> UI.goTo(b.dataset.view)));
    document.getElementById("nav-menu-btn").addEventListener("click", ()=> this.openAccount());
  },


  /* ---- menu lateral direito (celular): grupos que abrem e se segmentam (acordeão) ---- */
  renderDrawer(){
    const box = document.getElementById("dr-groups"); if(!box) return;
    box.innerHTML = this.views().map(v=>`
      <div class="dr-group${UI.currentView===v.id?' open':''}" data-view="${v.id}">
        <button type="button" class="dr-gbtn" data-dtoggle="${v.id}"><span class="dr-gic">${Icons.forNav(v.id)}</span><span class="dr-gl">${escapeHtml(v.aba)}</span><span class="dr-caret">${Icons.svg("caret")}</span></button>
        <div class="dr-items"><div class="dr-items-in">${this.items(v.id).map(it=>`<button type="button" class="dr-item" data-view="${v.id}" data-pane="${it.id}"><span class="dr-iic">${Icons.forNav(it.id)}</span><span>${escapeHtml(it.label)}</span></button>`).join("")}</div></div>
      </div>`).join("");
    box.querySelectorAll("[data-dtoggle]").forEach(b=> b.addEventListener("click", ()=>{
      const g = b.parentElement, abrir = !g.classList.contains("open");
      box.querySelectorAll(".dr-group.open").forEach(x=> x.classList.remove("open"));
      if(abrir) g.classList.add("open");
    }));
    box.querySelectorAll(".dr-item").forEach(b=> b.addEventListener("click", ()=>{ UI.goTo(b.dataset.view, b.dataset.pane); this.fecharDrawer(); }));
    this.syncDrawer();
  },
  syncDrawer(){
    document.querySelectorAll(".dr-item").forEach(b=> b.classList.toggle("active", b.dataset.view===UI.currentView && b.dataset.pane===UI.currentPane));
    document.querySelectorAll(".dr-group").forEach(g=> g.classList.toggle("current", g.dataset.view===UI.currentView));
    const u = Auth.user;
    if(u){
      const nome = u.nome || (u.legacy ? "Acesso geral" : "Matrícula "+u.matricula);
      const set = (id,t)=>{ const e=document.getElementById(id); if(e) e.textContent=t; };
      set("dr-user-name", nome); set("dr-user-mat", u.legacy ? "Senha única (modo provisório)" : "Matrícula "+u.matricula); set("dr-avatar", (nome||"?").trim().charAt(0).toUpperCase());
    }
  },
  abrirDrawer(){
    const d = document.getElementById("drawer"); if(!d) return;
    // abre o grupo da tela atual
    document.querySelectorAll(".dr-group").forEach(g=> g.classList.toggle("open", g.dataset.view===UI.currentView));
    document.body.classList.add("drawer-open"); document.documentElement.classList.add("drawer-open"); d.setAttribute("aria-hidden","false");
    const m = document.getElementById("hdr-menu"); if(m) m.setAttribute("aria-expanded","true");
  },
  fecharDrawer(){
    const d = document.getElementById("drawer"); if(!d) return;
    document.body.classList.remove("drawer-open"); document.documentElement.classList.remove("drawer-open"); d.setAttribute("aria-hidden","true");
    const m = document.getElementById("hdr-menu"); if(m) m.setAttribute("aria-expanded","false");
  },
  initDrawer(){
    if(this._drawerOk) return; this._drawerOk = true;
    const $i = id=>document.getElementById(id);
    $i("hdr-menu").addEventListener("click", ()=> document.body.classList.contains("drawer-open") ? this.fecharDrawer() : this.abrirDrawer());
    $i("dr-close").addEventListener("click", ()=> this.fecharDrawer());
    $i("drawer-scrim").addEventListener("click", ()=> this.fecharDrawer());
    document.addEventListener("keydown", e=>{ if(e.key==="Escape") this.fecharDrawer(); });
    window.matchMedia("(min-width:900px)").addEventListener("change", e=>{ if(e.matches) this.fecharDrawer(); });
    // gesto: arrastar para a direita fecha
    let x0=null; const dr=$i("drawer");
    dr.addEventListener("touchstart", e=>{ x0=e.touches[0].clientX; }, {passive:true});
    dr.addEventListener("touchend", e=>{ if(x0!=null && e.changedTouches[0].clientX-x0>70) this.fecharDrawer(); x0=null; }, {passive:true});
    document.querySelectorAll("#drawer [data-dr]").forEach(b=> b.addEventListener("click", ()=>{
      const a=b.dataset.dr; this.fecharDrawer();
      if(a==="alertas") FeedbackAdv.abrirAlertas();
      else if(a==="refresh") UI.carregarOnline();
      else if(a==="arquivo") document.getElementById("file-input").click();
      else if(a==="png") Export.toPNG();
      else if(a==="pdf") Export.toPDF();
      else if(a==="sair") Auth.logout();
    }));
  },

  renderUser(){
    const u = Auth.user; if(!u) return;
    const nome = u.nome || (u.legacy ? "Acesso geral" : "Matrícula "+u.matricula);
    const set = (id,t)=>{ const e=document.getElementById(id); if(e) e.textContent=t; };
    set("sb-user-name", nome);
    set("sb-user-mat", u.legacy ? "Senha única (modo provisório)" : "Matrícula "+u.matricula);
    set("sb-avatar", (nome||"?").trim().charAt(0).toUpperCase());
  },

  // botões "acessar sem dados" da tela inicial: só aparecem para quem tem a permissão
  renderAtalhosVazio(){
    const show = (id, ok)=>{ const b=document.getElementById(id); if(b) b.style.display = ok ? "" : "none"; };
    show("btn-ir-avaria", Auth.can("indicadores","avaria"));
    show("btn-ir-cd3d", Auth.can("indicadores","cd3d"));
    show("btn-ir-admin", this.items("admin").length>0);
  },

  // destaca a sub aba atual e mostra o título no cabeçalho
  sync(){
    this.syncDrawer();
    document.querySelectorAll(".sb-item").forEach(b=> b.classList.toggle("active", b.dataset.view===UI.currentView && b.dataset.pane===UI.currentPane));
    document.querySelectorAll(".sb-group").forEach(g=>{ if(g.dataset.view===UI.currentView) g.classList.add("open"); g.classList.toggle("current", g.dataset.view===UI.currentView); });
    document.querySelectorAll("#main-nav .nav-btn[data-view]").forEach(b=> b.classList.toggle("active", b.dataset.view===UI.currentView));
    const it = (UI.subnavConfig[UI.currentView]||[]).find(i=>i.id===UI.currentPane);
    const v = NAV_VIEWS.find(x=>x.id===UI.currentView);
    const t = document.getElementById("hdr-title"), c = document.getElementById("hdr-crumb");
    if(t) t.textContent = it ? it.label : "NÚCLEO REPOSIÇÃO";
    if(c) c.textContent = (v && it) ? v.aba : "";
    const chip = document.querySelector("#sub-nav .subnav-btn.active");
    if(chip && chip.scrollIntoView){ try{ chip.scrollIntoView({ block:"nearest", inline:"center" }); }catch(e){} }
  },

  // "Conta" (celular): usuário + ações que no computador ficam no menu lateral / cabeçalho
  openAccount(){
    const u = Auth.user||{};
    const nome = u.nome || (u.legacy ? "Acesso geral" : "Matrícula "+(u.matricula||""));
    UI.openModal(`
      <h3 style="margin-top:0;">${escapeHtml(nome)}</h3>
      <p class="small-muted">${u.legacy ? "Modo provisório (senha única)" : "Matrícula "+escapeHtml(u.matricula||"")}</p>
      <div class="acct-actions">
        <button type="button" class="btn btn-outline" onclick="Nav.acao('refresh')">${Icons.svg("refresh")} Atualizar dados</button>
        <button type="button" class="btn btn-outline" onclick="Nav.acao('arquivo')">${Icons.svg("folder")} Carregar arquivo (plano B)</button>
        <button type="button" class="btn btn-outline" onclick="Nav.acao('tema')">${Icons.svg(Design.escuro()?"sun":"moon")} ${Design.escuro()?"Modo claro":"Modo escuro"}</button>
        <button type="button" class="btn btn-outline" onclick="Nav.acao('png')">${Icons.svg("image")} Exportar PNG</button>
        <button type="button" class="btn btn-outline" onclick="Nav.acao('pdf')">${Icons.svg("download")} Exportar PDF</button>
        <button type="button" class="btn btn-primary" onclick="Nav.acao('sair')">${Icons.svg("logout")} Sair</button>
      </div>`);
  },
  acao(a){
    UI.closeModal();
    if(a==="refresh") UI.carregarOnline();
    else if(a==="arquivo") document.getElementById("file-input").click();
    else if(a==="tema") Design.alternarTema();
    else if(a==="png") Export.toPNG();
    else if(a==="pdf") Export.toPDF();
    else if(a==="sair") Auth.logout();
  }
};


/* ---------------------------------------------------------------------- */
/* MODULE: Uso (mede o tempo ativo por tela e envia ao servidor)           */
/* ---------------------------------------------------------------------- */
const Uso = {
  acum: {}, ultimoTick: 0, ultimaAcao: 0, timer: null, ligado: false,
  TICK: 10000, OCIOSO: 120000, ENVIO: 120000, ultimoEnvio: 0,
  rotulo(){
    const v = NAV_VIEWS.find(x=>x.id===UI.currentView);
    const it = (UI.subnavConfig[UI.currentView]||[]).find(i=>i.id===UI.currentPane);
    return (v && it) ? v.aba+" > "+it.label : "";
  },
  iniciar(){
    if(this.ligado || !Api.configured() || !Auth.user || Auth.user.legacy) return;
    this.ligado = true; this.ultimoTick = Date.now(); this.ultimaAcao = Date.now(); this.ultimoEnvio = Date.now();
    const marca = ()=>{ this.ultimaAcao = Date.now(); };
    ["pointerdown","keydown","scroll","touchstart","mousemove"].forEach(ev=> window.addEventListener(ev, marca, {passive:true, capture:true}));
    document.addEventListener("visibilitychange", ()=>{ this.tick(); if(document.hidden) this.enviar(true); });
    window.addEventListener("pagehide", ()=> this.enviar(true));
    this.timer = setInterval(()=>{ this.tick(); if(Date.now()-this.ultimoEnvio >= this.ENVIO) this.enviar(); }, this.TICK);
  },
  // soma ao rótulo da tela atual apenas se a aba está visível e houve ação recente
  tick(){
    const agora = Date.now(), dt = Math.min(agora - this.ultimoTick, this.TICK*2); this.ultimoTick = agora;
    if(document.hidden || document.body.classList.contains("locked") || agora - this.ultimaAcao > this.OCIOSO) return;
    const r = this.rotulo(); if(!r) return;
    this.acum[r] = (this.acum[r]||0) + dt/1000;
  },
  enviar(){
    this.ultimoEnvio = Date.now();
    const itens = Object.keys(this.acum).map(p=>({ pane:p, seg:Math.round(this.acum[p]) })).filter(i=>i.seg>0);
    if(!itens.length || !Auth.user || !Auth.user.token) return;
    this.acum = {};
    const body = JSON.stringify({ acao:"uso", token:Auth.user.token, itens });
    try{ fetch(NUCLEO_API_URL, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body, keepalive:true }).catch(()=>{}); }catch(e){}
  }
};
document.addEventListener("loginOk", ()=> Uso.iniciar());

/* ---------------------------------------------------------------------- */
/* MODULE: Login (matrícula + senha; independe das libs de CDN)            */
/* ---------------------------------------------------------------------- */
const LoginModule = {
  init(){
    const logoSrc = "data:image/png;base64," + LOGO_BASE64;
    const loginLogo = document.getElementById("login-logo");
    const emptyLogo = document.getElementById("empty-logo");
    if(loginLogo) loginLogo.src = logoSrc;
    if(emptyLogo) emptyLogo.src = logoSrc;

    const form = document.getElementById("login-form");
    const input = document.getElementById("login-password");
    const matInput = document.getElementById("login-matricula");
    const matField = document.getElementById("login-mat-field");
    const errorBox = document.getElementById("login-error");
    const eyeBtn = document.getElementById("login-eye-toggle");
    const eyeOpen = document.getElementById("eye-icon-open");
    const eyeClosed = document.getElementById("eye-icon-closed");
    const sub = document.getElementById("login-subtitle");
    const submit = document.getElementById("login-submit");
    if(!form) return;

    const modoApi = Api.configured();
    if(matField) matField.style.display = modoApi ? "" : "none";
    if(sub) sub.textContent = modoApi ? "Acesso restrito. Informe sua matrícula e senha." : "Acesso restrito. Informe a senha para continuar.";

    eyeBtn.addEventListener("click", ()=>{
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      eyeOpen.style.display = showing ? "block" : "none";
      eyeClosed.style.display = showing ? "none" : "block";
      eyeBtn.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
      input.focus();
    });

    const erro = (msg)=>{ errorBox.textContent = msg; errorBox.classList.remove("ok"); errorBox.classList.add("show"); };


    // ---- abas Entrar / Redefinir senha, olhos de mostrar senha, "esqueci minha senha" ----
    const tabs = document.getElementById("login-tabs"), rform = document.getElementById("reset-form");
    const forgot = document.getElementById("login-forgot");
    if(modoApi && tabs && rform){
      tabs.style.display = ""; if(forgot) forgot.style.display = "";
      const rmsg = document.getElementById("reset-msg");
      const mostrarMsg = (t, ok)=>{ rmsg.textContent = t; rmsg.classList.toggle("ok", !!ok); rmsg.classList.add("show"); };
      const aba = (qual)=>{
        tabs.querySelectorAll(".login-tab").forEach(b=>{ const on = b.dataset.lt===qual; b.classList.toggle("active", on); b.setAttribute("aria-selected", on?"true":"false"); });
        form.style.display = qual==="entrar" ? "" : "none"; rform.style.display = qual==="redefinir" ? "" : "none";
        errorBox.classList.remove("show"); rmsg.classList.remove("show");
        const alvo = document.getElementById(qual==="entrar" ? "login-matricula" : "rs-mat");
        if(alvo){ if(qual==="redefinir" && matInput && matInput.value && !alvo.value) alvo.value = matInput.value; alvo.focus(); }
      };
      tabs.querySelectorAll(".login-tab").forEach(b=> b.addEventListener("click", ()=> aba(b.dataset.lt)));
      if(forgot) forgot.addEventListener("click", ()=> aba("redefinir"));
      rform.querySelectorAll("[data-eye]").forEach(btn=> btn.addEventListener("click", ()=>{
        const inp = document.getElementById(btn.dataset.eye), vis = inp.type==="text";
        inp.type = vis ? "password" : "text";
        btn.querySelector(".eye-o").style.display = vis ? "block" : "none"; btn.querySelector(".eye-c").style.display = vis ? "none" : "block";
        btn.setAttribute("aria-label", vis ? "Mostrar senha" : "Ocultar senha"); inp.focus();
      }));
      document.getElementById("reset-forgot").addEventListener("click", async ()=>{
        const mat = (document.getElementById("rs-mat").value||"").trim();
        if(!mat){ mostrarMsg("Digite sua matrícula acima para avisar o administrador."); return; }
        try{
          await Api.call({ acao:"senha_solicitar", matricula:mat });
          mostrarMsg("Pedido enviado. O administrador vai definir uma senha nova para você em Administração > Acessos.", true);
        }catch(err){ mostrarMsg(err.message || "Não foi possível enviar o pedido."); }
      });
      rform.addEventListener("submit", async (e)=>{
        e.preventDefault(); rmsg.classList.remove("show");
        const mat = (document.getElementById("rs-mat").value||"").trim(), atual = document.getElementById("rs-atual").value,
              nova = document.getElementById("rs-nova").value, conf = document.getElementById("rs-conf").value;
        if(!mat || !atual || !nova){ mostrarMsg("Preencha matrícula, senha atual e a nova senha."); return; }
        if(nova.length < 4){ mostrarMsg("A nova senha precisa ter ao menos 4 caracteres."); return; }
        if(nova !== conf){ mostrarMsg("A confirmação não confere com a nova senha."); return; }
        const btn = document.getElementById("reset-submit"), t0 = btn.textContent; btn.disabled = true; btn.textContent = "Salvando...";
        try{
          const r = await Api.call({ acao:"senha_redefinir", matricula:mat, senhaAtual:atual, novaSenha:nova });
          if(r && r.ok){
            rform.reset(); aba("entrar"); matInput.value = mat; input.value = ""; input.focus();
            erro("Senha alterada! Entre com a nova senha."); errorBox.classList.add("ok");
          } else mostrarMsg((r && r.erro) || "Não foi possível alterar a senha.");
        }catch(err){ mostrarMsg(err.message || "Não foi possível alterar a senha."); }
        finally{ btn.disabled = false; btn.textContent = t0; }
      });
      // a mensagem verde de "senha alterada" some no próximo erro
    }

    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      errorBox.classList.remove("show","ok");
      const senha = input.value;
      if(!modoApi){
        if(senha === LOGIN_PASSWORD){
          Auth.setUser({ legacy:true, matricula:"", nome:"Acesso geral", perms:[] });
          this.entrar();
        } else { erro("Senha incorreta. Tente novamente."); input.value=""; input.focus(); }
        return;
      }
      const mat = (matInput.value||"").trim();
      if(!mat || !senha){ erro("Informe matrícula e senha."); return; }
      submit.disabled = true; const txt = submit.textContent; submit.textContent = "Entrando...";
      try{
        const r = await Api.call({ acao:"login", matricula:mat, senha });
        if(r && r.ok){
          Auth.setUser({ matricula:r.matricula, nome:r.nome||"", token:r.token, perms:r.perms||[] });
          Auth.save();
          this.entrar();
        } else { erro((r && r.erro) || "Não foi possível entrar."); input.value=""; input.focus(); }
      }catch(err){ erro(err.message || "Não foi possível entrar."); }
      finally{ submit.disabled = false; submit.textContent = txt; }
    });

    // sessão salva (celular/tablet/computador entram direto; as permissões são conferidas de novo no servidor)
    if(modoApi){
      const salvo = Auth.load();
      if(salvo){ Auth.setUser(salvo); this.entrar(); this.revalidar(); return; }
    }
    (matInput && modoApi ? matInput : input).focus();
  },

  // entra, mas continua na tela de login enquanto os dados carregam (saudação + progresso discreto)
  entrar(){
    this.entrou = true;
    document.getElementById("login-screen").classList.add("carregando");
    Nav.render();
    document.dispatchEvent(new Event("loginOk"));
  },

  // libera o painel: a tela de entrada some suavemente
  liberar(){
    document.body.classList.remove("locked");
    const tela = document.getElementById("login-screen");
    tela.classList.add("saindo");
    setTimeout(()=>{ tela.classList.add("hidden"); tela.classList.remove("saindo","carregando"); }, 460);
  },

  mostrar(msg){
    document.body.classList.add("locked");
    this.entrou = false;
    document.getElementById("login-screen").classList.remove("hidden","carregando","saindo");
    const box = document.getElementById("login-error");
    if(box && msg){ box.textContent = msg; box.classList.add("show"); }
  },

  async revalidar(){
    try{
      const r = await Api.call({ acao:"sessao" });
      if(r && r.ok){
        Auth.setUser(Object.assign({}, Auth.user, { nome:r.nome||Auth.user.nome, perms:r.perms||[] }));
        Auth.save();
        UI.garantirViewPermitida();
        Nav.render();
      }
    }catch(e){ /* sem internet: segue com as permissões salvas */ }
  }
};

// a tela de login não depende das bibliotecas de CDN — inicializa assim que o DOM está pronto
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", ()=> LoginModule.init());
} else {
  LoginModule.init();
}

/* =========================================================================
   CENTRAL DE REPOSIÇÃO — app.js
   Módulos: Loader | Processor | CurrentTeam | Filters | Production |
            Projection | Feedback | Attendance | Audit | Commission |
            Missions | Charts | Export | UI
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/* CONFIG                                                                  */
/* ---------------------------------------------------------------------- */
const REQUIRED_SHEETS = ["FEEDBACK REP","QUADRO REP","8271","8460"];
// "AUDITORIA REP" deixou de ser aba obrigatória do Excel: a fonte agora é a planilha Google Sheets
// online (AUDITORIA_REP_ONLINE_SHEET_ID). Se a aba ainda existir no Excel, serve só de reserva
// caso a planilha online não possa ser lida.
const OPTIONAL_SHEETS = ["AUDITORIA REP", "MISSÕES", "CRONOGRAMA", "TURNOVER", "8457", "8022", "9712", "REP.AVARIA", "8022 Nova", "Capacidade Realizada", "Tipo", "1707", "ADVERTÊNCIAS", "FÉRIAS AGENDADAS"]; // carregadas se existirem, não causam erro se faltarem

// Planilha Google Sheets (compartilhada como "qualquer pessoa com o link") que concentra TODAS as abas do
// painel (mesmos nomes de aba do NUCLEO REPOSIÇÃO.xlsx). O site busca tudo daqui ao abrir.
const ONLINE_SHEET_ID = "1KCLXuzpf6j4yvd6e5ALcthyW483TOMk5rzJ7XJaLmhQ";
// abas lidas por POSIÇÃO de coluna (sem linha de cabeçalho)
const ONLINE_SEM_CABECALHO = ["1707"];
const AUDITORIA_REP_COLUMNS = ["DATA","RUA","COD","NOME","PROD END ERRADO?","MULTIPLO SEPARADO?","AVARIA RECOLHIDA?","PROD SEM SALDO?","RUA LIMPA?","PROD VENCIDO?","PROD PROX AO VENC"];

const REQUIRED_COLUMNS = {
  "AUDITORIA REP": AUDITORIA_REP_COLUMNS, // só validada quando a aba existe (opcional)
  "FEEDBACK REP": ["Data","Cod","Nome","Resumo Assunto","Avaliação Pessoal","Avaliação Gestor","Desempenho","Classificação"],
  "QUADRO REP": ["DATA","CODIGO","NOME","STATUS"],
  "8271": ["DATA","RUA","TIPOOS","NUMOS"],
  "8460": ["CODFUNCOS","NOME","NUMOS","TIPOOS","DTFIMSEPARACAO"],
  "MISSÕES": ["DATA","HORA INICIO","HORA FIM","CODIGO","NOME","TIPO"],
  "ADVERTÊNCIAS": ["Data","Cod","Nome","Motivo"],
  "FÉRIAS AGENDADAS": ["Cod","Nome","Data Inicio","Data Fim"]
};

const AUDIT_CRITERIA = [
  "PROD END ERRADO?","MULTIPLO SEPARADO?","AVARIA RECOLHIDA?",
  "PROD SEM SALDO?","RUA LIMPA?","PROD VENCIDO?","PROD PROX AO VENC"
];

const MESES_PT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const MESES_PT_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA_PT = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

const DEFAULT_COMMISSION_CONFIG = {
  bands: [
    { min:0,   max:399, value:0.40, active:true },
    { min:400, max:499, value:0.50, active:true },
    { min:500, max:599, value:0.60, active:true },
    { min:600, max:699, value:0.70, active:true },
    { min:700, max:999999, value:0.80, active:true }
  ],
  exceptions: [],
  missions: [
    { name:"Separação de Múltiplos", qty:1, osEquiv:6, valuePerOs:0.50 }
  ]
};

/* ---------------------------------------------------------------------- */
/* HELPERS                                                                 */
/* ---------------------------------------------------------------------- */
const $ = (sel, ctx) => (ctx||document).querySelector(sel);
const $all = (sel, ctx) => Array.from((ctx||document).querySelectorAll(sel));

function toast(msg, type, opts){
  if(window.Design) return Design.toast(msg, type, opts);
  const el = $("#toast");
  el.textContent = msg;
  el.className = "show" + (type ? " "+type : "");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>{ el.classList.remove("show"); }, 3800);
}

function normStr(s){
  if(s===null||s===undefined) return "";
  return String(s).trim().toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function trimStr(s){ return (s===null||s===undefined) ? "" : String(s).trim(); }

// Busca um campo em um objeto (linha de planilha) tolerando variações de
// maiúsculas/minúsculas, acentuação e espaços no nome da coluna.
function getFieldFlexible(row, aliases){
  const keys = Object.keys(row);
  for(const alias of aliases){
    const wantNorm = normStr(alias);
    const foundKey = keys.find(k=>normStr(k)===wantNorm);
    if(foundKey!==undefined && row[foundKey]!==undefined) return row[foundKey];
  }
  return null;
}

// Converte um valor de horário (Date, número de série do Excel, ou string "HH:MM")
// em minutos totais desde 00:00. Retorna null se não for possível interpretar.
// isDateLike usa duck-typing (Object.prototype.toString) em vez de "instanceof Date"
// para funcionar mesmo com objetos Date vindos de outro realm/iframe/worker.
function isDateLike(v){
  return v!==null && typeof v==="object" && Object.prototype.toString.call(v)==="[object Date]";
}
function parseTimeToMinutes(v){
  if(v===null || v===undefined || v==="") return null;
  if(isDateLike(v)){
    if(isNaN(v.getTime())) return null;
    return v.getHours()*60 + v.getMinutes() + v.getSeconds()/60;
  }
  if(typeof v === "number"){
    // fração de dia (padrão Excel para células de hora): 0.5 = 12:00
    if(v >= 0 && v < 1) return v*24*60;
    // hora decimal (ex: 17.5 = 17:30) — comum quando a célula não está formatada como hora
    if(v >= 1 && v <= 24) return v*60;
    // formato HHMM (ex: 1730 = 17:30)
    if(v >= 100 && v <= 2359 && v%100 < 60){
      const h = Math.floor(v/100), m = v%100;
      return h*60 + m;
    }
    // já em minutos (fallback)
    return v;
  }
  if(typeof v === "string"){
    const m = v.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if(m) return Number(m[1])*60 + Number(m[2]) + (m[3]?Number(m[3])/60:0);
  }
  return null;
}

function toDate(v){
  if(v===null||v===undefined||v==="") return null;
  if(isDateLike(v)) return isNaN(v.getTime()) ? null : v;
  if(typeof v === "number"){
    // excel serial fallback
    const d = XLSX.SSF.parse_date_code(v);
    if(!d) return null;
    return new Date(d.y, d.m-1, d.d, d.H||0, d.M||0, d.S||0);
  }
  if(typeof v === "string"){
    // dd/mm/aa ou dd/mm/aaaa (padrão brasileiro). Nunca deixar o navegador adivinhar: "12/08/26" viraria 8 de dezembro.
    const m = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if(m){
      const ano = m[3].length===2 ? 2000+Number(m[3]) : Number(m[3]);
      const d = new Date(ano, Number(m[2])-1, Number(m[1]), Number(m[4]||0), Number(m[5]||0), Number(m[6]||0));
      return isNaN(d.getTime()) || d.getMonth()!==Number(m[2])-1 ? null : d;
    }
  }
  const parsed = new Date(v);
  return isNaN(parsed.getTime()) ? null : parsed;
}
function dateOnly(d){ return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null; }
function fmtDateBR(d){
  if(!d) return "-";
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}
function fmtMonthYear(y,m){ return `${MESES_PT[m]}/${y}`; }
function ymKey(d){ return d.getFullYear()*100 + (d.getMonth()+1); }
function ymdKey(d){ return d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate(); }
function addDays(d, n){ const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function addMonths(d, n){ const r = new Date(d); r.setMonth(r.getMonth()+n); return r; }
const MESES_CAP = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
function daysBetween(a,b){ return Math.round((dateOnly(b) - dateOnly(a)) / 86400000); }
function fmtNum(n, dec){ 
  if(n===null||n===undefined||isNaN(n)) return "-";
  return n.toLocaleString("pt-BR", {minimumFractionDigits:dec||0, maximumFractionDigits:dec||0});
}
function fmtPct(n, dec){
  if(n===null||n===undefined||isNaN(n) || !isFinite(n)) return "-";
  const s = n.toLocaleString("pt-BR", {minimumFractionDigits:dec||1, maximumFractionDigits:dec||1});
  return (n>0?"+":"") + s + "%";
}
function fmtBRL(n){
  if(n===null||n===undefined||isNaN(n)) return "-";
  return n.toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}
function pctVariation(atual, anterior){
  if(anterior===0 || anterior===null || anterior===undefined) return null;
  return ((atual-anterior)/anterior)*100;
}
function variationTag(v){
  if(v===null||v===undefined||!isFinite(v)) return `<span class="tag-neutral">s/ base</span>`;
  if(v>0.001) return `<span class="tag-pos">${fmtPct(v,1)}</span>`;
  if(v<-0.001) return `<span class="tag-neg">${fmtPct(v,1)}</span>`;
  return `<span class="tag-neutral">0.0%</span>`;
}
function cardClassForVar(v){
  if(v===null||v===undefined||!isFinite(v)) return "";
  if(v>0.001) return "pos";
  if(v<-0.001) return "neg";
  return "";
}
function weekOfYearMonday(d){
  // ISO-ish week number, week starts Monday
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(),0,4));
  const weekNum = 1 + Math.round(((date - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay()+6)%7)) / 7);
  return { year: date.getUTCFullYear(), week: weekNum };
}
function startOfWeekMonday(d){
  const day = (d.getDay()+6)%7; // 0=monday
  return dateOnly(addDays(d, -day));
}

/* ---------------------------------------------------------------------- */
/* DIAS ÚTEIS — a empresa trabalha apenas de Segunda a Sexta. Toda média e
   projeção de produção usa dia útil como unidade, não dia corrido.        */
/* ---------------------------------------------------------------------- */
function isWeekday(date){
  const dow = date.getDay(); // 0=domingo, 6=sábado
  return dow>=1 && dow<=5;
}
function countWeekdaysInMonth(year, month){
  const totalDays = new Date(year, month+1, 0).getDate();
  let count = 0;
  for(let d=1; d<=totalDays; d++){ if(isWeekday(new Date(year,month,d))) count++; }
  return count;
}
function countWeekdaysUpToDay(year, month, uptoDay){
  let count = 0;
  for(let d=1; d<=uptoDay; d++){ if(isWeekday(new Date(year,month,d))) count++; }
  return count;
}

function escapeHtml(s){
  return String(s===null||s===undefined?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function uniq(arr){ return Array.from(new Set(arr)); }
function sum(arr){ return arr.reduce((a,b)=>a+b,0); }
function avg(arr){ return arr.length ? sum(arr)/arr.length : 0; }

/* ---------------------------------------------------------------------- */
/* MODULE: Excel Loader                                                    */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* MODULE: LoadingScreen (tela de carregamento do arquivo)                 */
/* ---------------------------------------------------------------------- */
const LoadingScreen = {
  rotulos: { recebido:"Conectando", lendo:"Lendo planilhas", validando:"Validando", sheets:"Organizando abas", processando:"Processando", finalizando:"Finalizando" },
  steps: [ { id:"recebido" }, { id:"lendo" }, { id:"validando" }, { id:"sheets" }, { id:"processando" }, { id:"finalizando" } ],
  /** ctx: "login" (tela de entrada) ou "painel" (atualização com o painel aberto) */
  show(filename, ctx){
    this.ctx = ctx || "painel";
    Design.carga.iniciar(this.ctx, filename);
  },
  async step(stepId){ Design.carga.etapa(this.rotulos[stepId] || ""); },
  progresso(feitas, total, nome, info){
    Design.carga.progresso(feitas, total);
    if(nome) Design.carga.item(nome, info && info.status === "ok" ? "ok" : "warn", info && info.status === "ok" ? (info.linhas||0).toLocaleString("pt-BR") : "sem dados");
  },
  hide(){ Design.carga.fim(); Design.carga.saiFeed(500); }
};

/* ---------------------------------------------------------------------- */
/* MODULE: ImportLog (tela de log de importação, pós-processamento)        */
/* ---------------------------------------------------------------------- */
const ImportLog = {
  root(){ return document.getElementById("flow-overlay-root"); },

  // varre as linhas de uma sheet procurando colunas cujo nome contenha DATA/DT e
  // retorna a data mais recente encontrada entre elas. Não inventa datas: se não
  // achar nenhuma coluna candidata ou nenhum valor válido, retorna null.
  detectMaxDate(rows){
    if(!rows || !rows.length) return null;
    const sampleKeys = Object.keys(rows[0]||{});
    const dateKeys = sampleKeys.filter(k=>/DATA/i.test(k) || /^DT/i.test(k));
    if(!dateKeys.length) return null;
    let max = null;
    rows.forEach(r=>{
      dateKeys.forEach(k=>{
        const d = toDate(r[k]);
        if(d && !isNaN(d.getTime()) && d.getFullYear()>1901){
          if(!max || d>max) max = d;
        }
      });
    });
    return max;
  },

  // monta o log dinâmico a partir do "raw" realmente carregado — nunca lista sheets
  // fixas/hardcoded, sempre a partir de REQUIRED_SHEETS + OPTIONAL_SHEETS + o que
  // efetivamente veio em raw
  buildLog(raw){
    // "AUDITORIA REP" saiu do log: as bases de auditoria agora são Auditoria_Ruas e Auditoria_Retorno (+ apoio)
    const allSheets = uniq([...REQUIRED_SHEETS, ...OPTIONAL_SHEETS]).filter(n=>n!=="AUDITORIA REP");
    const oi0 = OnlineSheets.info;
    return allSheets.map(name0=>{
      const rows = raw[name0];
      const oi = oi0 && oi0.abas ? oi0.abas[name0] : null;
      const name = oi && oi.status==="ok" ? name0+" (Google Sheets)" : name0;
      if(oi && oi.status==="erro"){
        return { name, status:"alerta", statusLabel:"⚠️ Falha ao ler (online)", date:null, msg:`Aba ${name0}: ${oi.motivo}`, rowCount:0 };
      }
      if(name0==="AUDITORIA REP" && oi0 && (rows===null || rows===undefined || (oi && oi.status!=="ok"))){
        return { name, status:"alerta", statusLabel:"⚠️ Não encontrada", date:null,
          msg:`A aba AUDITORIA REP não foi encontrada na planilha online${oi&&oi.motivo?" ("+oi.motivo+")":""}. Os indicadores de auditoria ficarão vazios.`, rowCount:0 };
      }
      if(rows===null || rows===undefined){
        return { name, status:"nao-encontrada", statusLabel:"— Não encontrada (opcional)", date:null, msg:null, rowCount:0 };
      }
      if(!rows.length){
        return { name, status:"vazia", statusLabel:"Sem dados", date:null, msg:"A aba foi encontrada, mas não contém nenhuma linha de dados.", rowCount:0 };
      }
      const maxDate = this.detectMaxDate(rows);
      if(!maxDate){
        return { name, status:"alerta", statusLabel:"⚠️ Carregada com alerta", date:null,
          msg:`Sheet ${name} carregada, porém nenhuma coluna de data válida foi identificada.`, rowCount:rows.length };
      }
      return { name, status:"ok", statusLabel:"✓ Carregada", date:maxDate, msg:null, rowCount:rows.length };
    }).concat(this.logAuditoria());
  },

  // bases de auditoria lidas direto do Google Sheets de auditoria (fora do Excel/planilha principal)
  logAuditoria(){
    const mk = (nome, rows, erro, carregou)=>{
      const name = nome+" (Google Sheets)";
      if(erro) return { name, status:"alerta", statusLabel:"⚠️ Falha ao ler (online)", date:null, msg:`Aba ${nome}: ${erro}`, rowCount:0 };
      if(!carregou) return { name, status:"alerta", statusLabel:"⚠️ Não carregada", date:null, msg:`Aba ${nome} não foi lida nesta carga.`, rowCount:0 };
      if(!rows.length) return { name, status:"vazia", statusLabel:"Sem dados", date:null, msg:"A aba foi encontrada, mas não contém nenhuma linha de dados.", rowCount:0 };
      return { name, status:"ok", statusLabel:"✓ Carregada", date:this.detectMaxDate(rows), msg:null, rowCount:rows.length };
    };
    const out = [];
    if(typeof AuditOnline!=="undefined"){
      out.push(mk("Auditoria_Ruas", AuditOnline.rows||[], AuditOnline.error, AuditOnline.rows!==null));
    }
    if(typeof RetornoQ!=="undefined"){
      const D = RetornoQ.dados, e = RetornoQ.erro, ok = !!D;
      out.push(mk("Auditoria_Retorno", ok?D.aud:[], e, ok));
      out.push(mk("Rotina_Retorno", ok?D.rot:[], e, ok));
      out.push(mk("Quadro_Repositores", ok?D.reps:[], e, ok));
    }
    return out;
  },

  show(file, raw, onAccessDashboard, onLoadAnother){
    const log = this.buildLog(raw);
    const encontradas = log.filter(s=>s.status!=="nao-encontrada");
    const comSucesso = log.filter(s=>s.status==="ok"||s.status==="vazia");
    const comAlerta = log.filter(s=>s.status==="alerta");
    const agora = new Date();

    const statusCls = (s)=> s==="ok"?"ok": s==="alerta"?"alerta": s==="vazia"?"vazia": "vazia";

    const root = this.root();
    root.innerHTML = `
      <div class="flow-backdrop">
        <div class="flow-card wide">
          <div class="flow-log-header">
            <div class="flow-log-check">✓</div>
            <div>
              <div class="flow-log-title">Arquivo processado com sucesso</div>
              <div class="flow-log-sub">📄 ${escapeHtml(file.name)} · carregado em ${fmtDateBR(agora)} às ${agora.toLocaleTimeString('pt-BR')}</div>
            </div>
          </div>

          <div class="flow-summary-grid">
            <div class="flow-summary-card"><div class="flow-summary-label">Sheets Encontradas</div><div class="flow-summary-value">${encontradas.length}</div></div>
            <div class="flow-summary-card"><div class="flow-summary-label">Processadas OK</div><div class="flow-summary-value" style="color:var(--green);">${comSucesso.length}</div></div>
            <div class="flow-summary-card"><div class="flow-summary-label">Com Alerta</div><div class="flow-summary-value" style="color:${comAlerta.length?'var(--orange)':'var(--gray-300)'};">${comAlerta.length}</div></div>
            <div class="flow-summary-card"><div class="flow-summary-label">Total de Abas no Arquivo</div><div class="flow-summary-value">${log.length}</div></div>
          </div>

          <table class="flow-sheet-table">
            <thead><tr><th>Sheet</th><th>Status</th><th>Registros</th><th>Última Data Encontrada</th></tr></thead>
            <tbody>
              ${log.map((s,i)=>`
                <tr style="animation-delay:${i*30}ms;">
                  <td><strong>${escapeHtml(s.name)}</strong></td>
                  <td><span class="flow-sheet-status ${statusCls(s.status)}">${s.statusLabel}</span></td>
                  <td>${s.status==="nao-encontrada"?"—":fmtNum(s.rowCount)}</td>
                  <td>${s.date?fmtDateBR(s.date):(s.status==="nao-encontrada"?"—":"Sem data identificada")}</td>
                </tr>`).join("")}
            </tbody>
          </table>

          ${comAlerta.length ? `<div class="warn-box" style="margin-bottom:18px;">${comAlerta.map(s=>escapeHtml(s.msg)).join("<br>")}</div>` : ``}

          <div class="flow-log-actions">
            <button class="btn btn-outline" id="flow-btn-outro">Carregar outro arquivo</button>
            <button class="btn btn-primary" id="flow-btn-entrar">Acessar Dashboard →</button>
          </div>
        </div>
      </div>`;
    root.classList.add("show");

    document.getElementById("flow-btn-entrar").addEventListener("click", ()=>{
      this.hide();
      onAccessDashboard();
    });
    document.getElementById("flow-btn-outro").addEventListener("click", ()=>{
      this.hide();
      onLoadAnother();
    });
  },

  hide(){
    const root = this.root();
    root.classList.remove("show");
    root.innerHTML = "";
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: OnlineSheets (fonte principal: planilha Google Sheets)          */
/* ---------------------------------------------------------------------- */
/* Busca cada aba pelo endpoint gviz (CSV, com CORS liberado para planilhas públicas), converte o
   texto das células em valores tipados (número / data como serial Excel) e monta um workbook do
   SheetJS em memória. Assim o ExcelLoader.fromWorkbook() e todo o resto do painel funcionam
   exatamente como se o Excel tivesse sido carregado.
   Atenção: quando o nome da aba pedida não existe, o gviz devolve SILENCIOSAMENTE a primeira aba.
   Por isso cada aba é validada (colunas obrigatórias e "impressão digital" do cabeçalho). */
const OnlineSheets = {
  info: null, // { modo:"online"|"arquivo", quando:Date, abas:{ [nome]: {status:"ok"|"ausente"|"erro", linhas, motivo} } }
  _fp: null,

  url(name, extra){
    return `https://docs.google.com/spreadsheets/d/${ONLINE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}${extra||""}&_ts=${Date.now()}`;
  },

  async fetchText(name, extra){
    const ctrl = (typeof AbortController!=="undefined") ? new AbortController() : null;
    const timer = ctrl ? setTimeout(()=>ctrl.abort(), 90000) : null;
    try{
      const res = await fetch(this.url(name, extra), { cache:"no-store", signal: ctrl ? ctrl.signal : undefined });
      if(!res.ok) throw new Error("HTTP "+res.status+". Verifique se a planilha está compartilhada como 'Qualquer pessoa com o link pode visualizar'.");
      const text = await res.text();
      if(/^\s*</.test(text)) throw new Error("A planilha não devolveu dados (provavelmente não está compartilhada publicamente).");
      return text;
    }catch(e){
      if(e && e.name==="AbortError") throw new Error("Tempo esgotado ao buscar a aba (conexão lenta ou aba muito grande).");
      throw e;
    }finally{
      if(timer) clearTimeout(timer);
    }
  },

  // 1ª linha devolvida quando se pede uma aba inexistente (= cabeçalho da 1ª aba da planilha)
  fingerprint(){
    if(!this._fp){
      this._fp = this.fetchText("__aba_inexistente__", "&tq="+encodeURIComponent("select * limit 1"))
        .then(t=>t.split("\n")[0].trim()).catch(()=>null);
    }
    return this._fp;
  },

  // dia/mês/ano [hh:mm[:ss]] → serial do Excel (o painel já trata serial em toDate)
  serial(y, mo, d, H, M, S){
    return (Date.UTC(y, mo-1, d, H, M, S) - Date.UTC(1899, 11, 30)) / 86400000;
  },

  // texto da célula → valor tipado (o CSV do Google vem formatado no padrão pt-BR)
  coerce(raw){
    const s = raw==null ? "" : String(raw).trim();
    if(s==="") return null;
    let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if(m) return this.serial(m[3].length===2 ? 2000+(+m[3]) : +m[3], +m[2], +m[1], +(m[4]||0), +(m[5]||0), +(m[6]||0));
    if(/^-?\d+$/.test(s)){
      if(/^-?0\d/.test(s) || s.replace("-","").length>15) return s; // zeros à esquerda / códigos longos (EAN) ficam texto
      return Number(s);
    }
    if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s) || /^-?\d+,\d+$/.test(s)) return Number(s.replace(/\./g,"").replace(",","."));
    if(/^-?\d+\.\d+$/.test(s)) return Number(s);
    return s;
  },

  // CSV → matriz tipada; descarta a linha de rótulos genéricos (A, B, C...) que o gviz às vezes insere
  parseAoa(text, semCabecalho){
    let lines = AuditOnline.splitCSV(text);
    if(lines.length && lines[0].every(c=>/^\s*[A-Z]{0,2}\s*$/.test(c)) && lines.length>1) lines = lines.slice(1);
    const hdr = (c)=>{ const t=String(c==null?"":c).trim(); return t===""?null:t; };
    return lines.map((cols,li)=> (li===0 && !semCabecalho) ? cols.map(hdr) : cols.map(c=>this.coerce(c)));
  },

  // linhas de dados (objetos por nome de coluna) a partir de uma matriz — mesmo formato do SheetJS
  aoaToRows(aoa){
    return XLSX.utils.sheet_to_json(XLSX.utils.aoa_to_sheet(aoa), { defval:null, raw:true });
  },

  // busca UMA aba. Devolve { aoa } ou { ausente:true } ou lança erro (rede/permissão)
  async fetchTab(name){
    const semCab = ONLINE_SEM_CABECALHO.includes(name);
    const [text, fp] = await Promise.all([ this.fetchText(name, semCab ? "&headers=0" : ""), this.fingerprint() ]);
    const first = text.split("\n")[0].trim();
    const aoa = this.parseAoa(text, semCab);
    if(!aoa.length) return { ausente:true, motivo:"aba vazia" };
    const exigidas = REQUIRED_COLUMNS[name];
    if(exigidas){
      const cols = aoa[0].filter(c=>c!=null).map(c=>normStr(c));
      const faltam = exigidas.filter(c=>!cols.includes(normStr(c)));
      if(faltam.length) return { ausente:true, motivo:"cabeçalho não confere (faltam: "+faltam.join(", ")+") — a aba provavelmente não existe com esse nome" };
    } else if(fp && first===fp && !semCab){
      return { ausente:true, motivo:"aba não encontrada com esse nome" };
    }
    return { aoa };
  },

  // busca todas as abas conhecidas em paralelo e monta o workbook
  async fetchWorkbook(onProgress){
    this._fp = null;
    const nomes = uniq([...REQUIRED_SHEETS, ...OPTIONAL_SHEETS]);
    const info = { modo:"online", quando:new Date(), abas:{} };
    const wb = XLSX.utils.book_new();
    let feitas = 0;
    const resultados = await Promise.all(nomes.map(async nome=>{
      try{
        const r = await this.fetchTab(nome);
        info.abas[nome] = r.aoa ? { status:"ok", linhas:Math.max(0, r.aoa.length-1) } : { status:"ausente", linhas:0, motivo:r.motivo };
        return { nome, aoa:r.aoa||null };
      }catch(e){
        info.abas[nome] = { status:"erro", linhas:0, motivo: e && e.message ? e.message : String(e) };
        return { nome, aoa:null };
      }finally{
        feitas++; if(onProgress) onProgress(feitas, nomes.length, nome, info.abas[nome]);
      }
    }));
    const erros = nomes.filter(n=>info.abas[n].status==="erro");
    if(erros.length===nomes.length){
      throw new Error("Não foi possível acessar a planilha online do Google Sheets.\n"+info.abas[nomes[0]].motivo);
    }
    resultados.forEach(r=>{ if(r.aoa) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(r.aoa), r.nome); });
    this.info = info;
    return wb;
  }
};

const ExcelLoader = {
  // verifica se as bibliotecas externas (CDN) carregaram corretamente
  checkLibraries(){
    const missing = [];
    if(typeof XLSX === "undefined") missing.push("SheetJS (leitura de Excel)");
    if(typeof Chart === "undefined") missing.push("Chart.js (gráficos)");
    if(typeof html2canvas === "undefined") missing.push("html2canvas (exportação PNG)");
    if(typeof window.jspdf === "undefined") missing.push("jsPDF (exportação PDF)");
    if(missing.length){
      throw new Error(
        "Não foi possível carregar a(s) biblioteca(s): " + missing.join(", ") + ".\n" +
        "Isso normalmente acontece por falta de conexão com a internet no momento em que a página abriu, " +
        "ou por um bloqueador de anúncios/extensão do navegador bloqueando o CDN (cdnjs.cloudflare.com).\n" +
        "Verifique sua conexão, desative temporariamente bloqueadores de conteúdo para esta página e recarregue-a."
      );
    }
  },

  // encontra o nome real da aba tolerando espaços extras e maiúsculas/minúsculas
  // "8022 Nova": em algumas versões do arquivo o cabeçalho ganhou uma coluna extra chamada "cap"
  // (posição O) que NÃO existe nas linhas de dados. Aí todos os nomes depois dela ficam deslocados
  // (CAPACIDADE lê o ponto de reposição, RUA lê o prédio...). Detecta pelo CODENDERECO/CODFILIAL e realinha.
  realinhar8022Nova(ws, json){
    try{
      const aoa = XLSX.utils.sheet_to_json(ws, { header:1, defval:null, raw:true });
      const hdr = (aoa[0]||[]).map(h=>h==null?"":String(h).trim());
      const iCap = hdr.indexOf("cap"), iEnd = hdr.indexOf("CODENDERECO"), iFil = hdr.indexOf("CODFILIAL");
      if(iCap < 0 || iEnd < 0 || iFil < 0) return json;
      const grandes = i => aoa.slice(1, 301).filter(r=>typeof r[i]==="number" && r[i] > 100000).length;
      if(grandes(iFil) <= grandes(iEnd)) return json;          // dados alinhados com o cabeçalho
      const nomes = hdr.filter((_,i)=>i!==iCap);
      return aoa.slice(1).filter(r=>r && r.some(v=>v!=null && v!=="")).map(r=>{
        const o = {}; nomes.forEach((h,j)=>{ if(h) o[h] = r[j]===undefined ? null : r[j]; }); return o;
      });
    }catch(e){ return json; }
  },

  resolveSheetName(wb, wanted){
    if(wb.SheetNames.includes(wanted)) return wanted;
    const wantedNorm = normStr(wanted);
    return wb.SheetNames.find(n => normStr(n) === wantedNorm) || null;
  },

  async load(file){
    this.checkLibraries();

    let buf;
    try{
      buf = await file.arrayBuffer();
    }catch(e){
      throw new Error("Não foi possível ler o arquivo selecionado: " + e.message);
    }

    let wb;
    try{
      wb = XLSX.read(buf, { type:"array", cellDates:true });
    }catch(e){
      throw new Error(
        "O arquivo não pôde ser interpretado como uma planilha Excel válida (.xlsx). " +
        "Detalhe técnico: " + e.message
      );
    }

    if(!wb.SheetNames || !wb.SheetNames.length){
      throw new Error("O arquivo foi lido, mas não contém nenhuma aba/planilha.");
    }

    OnlineSheets.info = { modo:"arquivo", quando:new Date(), abas:{} };
    const raw = this.fromWorkbook(wb, "arquivo");

    // AUDITORIA REP: se o Excel não trouxer a aba, busca na planilha online (Google Sheets)
    if(!(raw["AUDITORIA REP"] && raw["AUDITORIA REP"].length)){
      try{
        const r = await OnlineSheets.fetchTab("AUDITORIA REP");
        if(r.aoa){
          raw["AUDITORIA REP"] = OnlineSheets.aoaToRows(r.aoa);
          OnlineSheets.info.abas["AUDITORIA REP"] = { status:"ok", linhas:raw["AUDITORIA REP"].length };
        } else {
          OnlineSheets.info.abas["AUDITORIA REP"] = { status:"ausente", linhas:0, motivo:r.motivo };
        }
      }catch(e){
        OnlineSheets.info.abas["AUDITORIA REP"] = { status:"erro", linhas:0, motivo: e && e.message ? e.message : String(e) };
      }
    }
    return raw;
  },

  // Fonte principal: todas as abas vêm da planilha Google Sheets (sem arquivo)
  async loadOnline(onProgress){
    this.checkLibraries();
    const wb = await OnlineSheets.fetchWorkbook(onProgress);
    return this.fromWorkbook(wb, "online");
  },

  // Interpreta um workbook (lido do Excel OU montado a partir do Google Sheets) → raw por nome de aba
  fromWorkbook(wb, origem){
    const online = origem==="online";
    // resolve nomes reais das abas (tolerando espaços/maiúsculas diferentes)
    const sheetNameMap = {};
    const missingSheets = [];
    REQUIRED_SHEETS.forEach(s=>{
      const real = this.resolveSheetName(wb, s);
      if(real) sheetNameMap[s] = real;
      else missingSheets.push(s);
    });

    if(missingSheets.length){
      if(online){
        const det = missingSheets.map(n=>{ const a=OnlineSheets.info&&OnlineSheets.info.abas[n]; return n+(a&&a.motivo?" ("+a.motivo+")":""); });
        throw new Error("A planilha online não tem as abas obrigatórias: " + det.join("; ") +
          ". Abas encontradas: " + (wb.SheetNames.join(", ")||"(nenhuma)") + ". " +
          "Confira se os nomes das abas no Google Sheets estão exatamente iguais aos do Excel. Você também pode carregar o arquivo manualmente.");
      }
      throw new Error("As seguintes abas não foram encontradas no arquivo: " + missingSheets.join(", ") +
        ". Abas encontradas no arquivo: " + wb.SheetNames.join(", ") + ". " +
        "Verifique se o arquivo carregado é o NUCLEO REPOSIÇÃO.xlsx correto e se os nomes das abas não foram alterados.");
    }

    const raw = {};
    const colIssues = [];

    REQUIRED_SHEETS.forEach(sheetName=>{
      const ws = wb.Sheets[sheetNameMap[sheetName]];
      let json, headerRow;
      try{
        json = XLSX.utils.sheet_to_json(ws, { defval:null, raw:true });
        // lê a linha de cabeçalho diretamente (funciona mesmo se a aba não tiver linhas de dados)
        headerRow = XLSX.utils.sheet_to_json(ws, { header:1, range:0 })[0] || [];
      }catch(e){
        throw new Error(`Falha ao ler a aba "${sheetName}": ${e.message}`);
      }
      raw[sheetName] = json;

      const foundCols = headerRow.filter(c=>c!==null && c!==undefined && String(c).trim()!=="");
      const foundNorm = foundCols.map(c=>normStr(c));
      const missingCols = (REQUIRED_COLUMNS[sheetName]||[]).filter(rc=>{
        return !foundNorm.includes(normStr(rc));
      });
      if(missingCols.length){
        colIssues.push(`Aba "${sheetName}": coluna(s) não encontrada(s): ${missingCols.join(", ")}. ` +
          `Colunas encontradas nesta aba: ${foundCols.join(", ") || "(nenhuma)"}.`);
      }
    });

    // carrega sheets opcionais se existirem (não gera erro se faltar)
    OPTIONAL_SHEETS.forEach(sheetName=>{
      const real = this.resolveSheetName(wb, sheetName);
      if(real){
        try{
          raw[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[real], { defval:null, raw:true });
          if(sheetName === "8022 Nova") raw[sheetName] = ExcelLoader.realinhar8022Nova(wb.Sheets[real], raw[sheetName]);
          // 1707: o indicador de abastecimento lê a coluna R por POSIÇÃO, então guarda também a matriz bruta
          if(sheetName === "1707"){
            raw["1707__aoa"] = XLSX.utils.sheet_to_json(wb.Sheets[real], { header:1, defval:null, raw:true });
          }
        }catch(e){ raw[sheetName] = []; }
      } else {
        raw[sheetName] = null; // null = aba não existe
      }
    });

    if(colIssues.length){
      throw new Error("Foram encontradas divergências de colunas "+(online?"na planilha online":"no arquivo")+":\n" + colIssues.join("\n"));
    }

    return raw;
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Data Processor                                                  */
/* ---------------------------------------------------------------------- */
const DataProcessor = {
  process(raw){
    const out = {};

    // ---- AUDITORIA REP ----
    out.auditoria = (raw["AUDITORIA REP"]||[]).map((r,idx)=>{
      const data = toDate(r["DATA"]);
      const cod = r["COD"]!==null && r["COD"]!==undefined && r["COD"]!=="" ? String(r["COD"]).trim() : null;
      const nome = trimStr(r["NOME"]);
      const criteria = {};
      let simCount = 0, invalid = 0;
      AUDIT_CRITERIA.forEach(c=>{
        let v = r[c];
        v = v===null||v===undefined ? "" : String(v).trim().toUpperCase();
        if(v==="SIM"){ criteria[c]="SIM"; simCount++; }
        else if(v==="NÃO" || v==="NAO"){ criteria[c]="NÃO"; }
        else { criteria[c]="INVALIDO"; invalid++; }
      });
      return {
        _row: idx, data, rua: r["RUA"], cod, nome,
        codKey: cod ? normStr(cod) : (nome ? "NOME::"+normStr(nome) : null),
        criteria, simCount, invalid,
        qualidade: invalid>0 ? null : (simCount/7*100)
      };
    }).filter(r=>r.data);

    // ---- FEEDBACK REP ----
    out.feedback = raw["FEEDBACK REP"].map((r,idx)=>{
      const data = toDate(r["Data"]);
      const cod = r["Cod"]!==null && r["Cod"]!==undefined && r["Cod"]!=="" ? String(r["Cod"]).trim() : null;
      const nome = trimStr(r["Nome"]);
      const avPessoal = Number(r["Avaliação Pessoal"]);
      const avGestor = Number(r["Avaliação Gestor"]);
      return {
        _row: idx, data, cod, nome,
        codKey: cod ? normStr(cod) : (nome ? "NOME::"+normStr(nome) : null),
        resumo: trimStr(r["Resumo Assunto"]),
        avPessoal: isNaN(avPessoal)?null:avPessoal,
        avGestor: isNaN(avGestor)?null:avGestor,
        desempenho: trimStr(r["Desempenho"]),
        classificacao: trimStr(r["Classificação"]),
        motivo: trimStr(getFieldFlexible(r, ["Motivo","MOTIVO"])),
        anexo: trimStr(getFieldFlexible(r, ["Anexo","ANEXO","Link Anexo"])),
        aplicador: trimStr(getFieldFlexible(r, ["Nome Aplicador","NOME APLICADOR"])),
        isAdvertencia: /ADVERT/i.test(trimStr(r["Resumo Assunto"])+" "+trimStr(r["Classificação"])+" "+trimStr(r["Desempenho"]))
      };
    }).filter(r=>r.data || r.nome);

    // ---- ADVERTÊNCIAS (aba opcional, criada pelo lançamento) ----
    out.advertencias = (raw["ADVERTÊNCIAS"]||[]).map((r,idx)=>{
      const data = toDate(r["Data"]);
      const cod = r["Cod"]!==null && r["Cod"]!==undefined && r["Cod"]!=="" ? String(r["Cod"]).trim() : null;
      const nome = trimStr(r["Nome"]);
      return {
        _row: idx, data, cod, nome, codKey: cod ? normStr(cod) : (nome ? "NOME::"+normStr(nome) : null),
        motivo: trimStr(getFieldFlexible(r, ["Motivo","MOTIVO"])),
        resumo: trimStr(getFieldFlexible(r, ["Resumo Assunto","Resumo"])),
        anexo: trimStr(getFieldFlexible(r, ["Anexo","ANEXO"])),
        aplicador: trimStr(getFieldFlexible(r, ["Nome Aplicador"]))
      };
    }).filter(r=>r.data && r.codKey);
    out.advertenciasDispo = raw["ADVERTÊNCIAS"]!==null && raw["ADVERTÊNCIAS"]!==undefined;

    // ---- FÉRIAS AGENDADAS (aba opcional, criada pelo lançamento) ----
    out.feriasAgendadas = (raw["FÉRIAS AGENDADAS"]||[]).map((r,idx)=>{
      const cod = r["Cod"]!==null && r["Cod"]!==undefined && r["Cod"]!=="" ? String(r["Cod"]).trim() : null;
      const ini = toDate(r["Data Inicio"]), fim = toDate(r["Data Fim"]);
      const st = normStr(trimStr(getFieldFlexible(r, ["Status","STATUS"])));
      return { _row: idx, cod, nome: trimStr(r["Nome"]), codKey: cod ? normStr(cod) : null, ini, fim, dias: Number(r["Dias"])||0, cancelada: st==="CANCELADA" };
    }).filter(r=>r.codKey && r.ini && r.fim);

    // ---- QUADRO REP ----
    // CARGO é opcional (coluna nova): LIDER / AUXILIAR / REPOSITOR. Se a coluna não
    // existir no arquivo, cargoDisponivel fica false e tudo se comporta como antes
    // (compatibilidade retroativa — ninguém é excluído por falta dessa coluna).
    const quadroRowsRaw = raw["QUADRO REP"];
    const cargoDisponivel = quadroRowsRaw.some(r => Object.keys(r).some(k=>normStr(k)==="CARGO"));

    out.quadro = raw["QUADRO REP"].map((r,idx)=>{
      const data = toDate(r["DATA"]);
      const codigo = r["CODIGO"]!==null && r["CODIGO"]!==undefined && r["CODIGO"]!=="" ? String(r["CODIGO"]).trim() : null;
      const nome = trimStr(r["NOME"]);
      const statusRaw = trimStr(r["STATUS"]);
      const statusNorm = normStr(statusRaw);
      let bucket = "OUTRO";
      if(statusNorm==="PRESENTE") bucket = "PRESENTE";
      else if(statusNorm==="FALTA") bucket = "FALTA";
      else if(statusNorm==="FOLGA") bucket = "FOLGA";
      else if(statusNorm==="FERIAS") bucket = "FERIAS";
      else if(statusNorm==="ATESTADO") bucket = "ATESTADO";
      else if(statusNorm==="SUSPENSAO") bucket = "SUSPENSAO"; // fora da presença e do absenteísmo (como folga)
      else if(statusRaw!=="") bucket = "SEGUNDO_TURNO"; // ex: 10HRS, SEG TURNO etc — variações tratadas como turno extra

      const cargoRaw = trimStr(getFieldFlexible(r, ["CARGO","Cargo"]));
      const cargoNorm = normStr(cargoRaw);
      let cargo = null; // null = não informado / desconhecido
      if(cargoNorm==="LIDER") cargo = "LIDER";
      else if(cargoNorm==="AUXILIAR") cargo = "AUXILIAR";
      else if(cargoNorm==="REPOSITOR") cargo = "REPOSITOR";
      else if(cargoRaw!=="") cargo = "OUTRO"; // valor presente mas fora do padrão esperado

      return {
        _row: idx, data, codigo, nome,
        codKey: codigo ? normStr(codigo) : (nome ? "NOME::"+normStr(nome) : null),
        statusRaw, bucket, cargo, cargoRaw
      };
    }).filter(r=>r.data && r.codKey);
    out.cargoDisponivel = cargoDisponivel;

    // ---- 8271 ----
    out.p8271 = raw["8271"].map((r,idx)=>{
      const data = toDate(r["DATA"]);
      const tipoos = r["TIPOOS"]!==null && r["TIPOOS"]!==undefined ? Number(r["TIPOOS"]) : null;
      return {
        _row: idx, data, rua: r["RUA"]!==null&&r["RUA"]!==undefined ? Number(r["RUA"]) : null,
        tipoos, numos: r["NUMOS"], codendereco: r["CODENDERECO"], descricao: trimStr(r["DESCRICAO"])
      };
    }).filter(r=>r.data);

    // ---- 8460 ----
    // Usa DTFIMSEPARACAO (não DTINICIOOS) como data da O.S. — uma O.S. tipo 58 só
    // pode ser contabilizada como "feita" quando ela foi de fato FINALIZADA (separação
    // concluída). Se a O.S. ainda não terminou, DTFIMSEPARACAO fica vazia e a linha é
    // descartada automaticamente pelo filtro abaixo (r=>r.dtinicio).
    // Mantém o nome interno do campo como "dtinicio" (usado em todo o resto do app —
    // Produção, Comissão, Missões, Acompanhamento Individual etc.) para não precisar
    // alterar todas as outras funções; o que muda é só a coluna de origem.
    out.p8460 = raw["8460"].map((r,idx)=>{
      const dtinicio = toDate(getFieldFlexible(r, ["DTFIMSEPARACAO","DT FIM SEPARACAO","DATA FIM SEPARACAO"]));
      const cod = r["CODFUNCOS"]!==null && r["CODFUNCOS"]!==undefined && r["CODFUNCOS"]!=="" ? String(r["CODFUNCOS"]).trim() : null;
      const nome = trimStr(r["NOME"]);
      const tipoos = r["TIPOOS"]!==null && r["TIPOOS"]!==undefined ? Number(r["TIPOOS"]) : null;
      return {
        _row: idx, dtinicio, cod, nome,
        codKey: cod ? normStr(cod) : (nome ? "NOME::"+normStr(nome) : null),
        tipoos, numos: r["NUMOS"]
      };
    }).filter(r=>r.dtinicio);

    // ---- MISSÕES (opcional) ----
    // Colunas aceitas com flexibilidade de nome/maiúsculas/acentos:
    // DATA, CODIGO/COD, NOME, HORA INICIO, HORA FIM, TEMPO TOTAL, REGRA/TIPO
    const missaoRaw = raw["MISSÕES"];
    out.missoes = missaoRaw ? missaoRaw.map((r,idx)=>{
      const dataRaw = getFieldFlexible(r, ["DATA"]);
      const data = toDate(dataRaw);
      const codRaw = getFieldFlexible(r, ["CODIGO","COD","Código","Cod"]);
      const cod = codRaw!==null && codRaw!==undefined && codRaw!=="" ? String(codRaw).trim() : null;
      const nome = trimStr(getFieldFlexible(r, ["NOME","Nome"]));

      const horaInicioRaw = getFieldFlexible(r, ["HORA INICIO","HORA INÍCIO","Hora Inicio","Hora Início"]);
      const horaFimRaw = getFieldFlexible(r, ["HORA FIM","Hora Fim"]);
      const regra = trimStr(getFieldFlexible(r, ["REGRA","Regra","TIPO","Tipo"]));

      // Calcula automaticamente o Tempo Total (em horas) pela diferença Hora Fim - Hora Início
      const minIni = parseTimeToMinutes(horaInicioRaw);
      const minFim = parseTimeToMinutes(horaFimRaw);
      let tempoTotalHoras = null;
      if(minIni!==null && minFim!==null){
        let diff = minFim - minIni;
        if(diff < 0) diff += 24*60; // segurança: missão que atravessa a meia-noite
        tempoTotalHoras = diff / 60;
      }

      return {
        _row: idx, data,
        horaInicioRaw, horaFimRaw,
        horaInicio: trimStr(horaInicioRaw),
        horaFim: trimStr(horaFimRaw),
        tempoTotalHoras, // null se não foi possível calcular
        cod, nome,
        codKey: cod ? normStr(cod) : (nome ? "NOME::"+normStr(nome) : null),
        regra
      };
    }).filter(r=>r.codKey && r.tempoTotalHoras!==null) : [];
    out.missoesDispo = missaoRaw !== null && missaoRaw !== undefined; // true = aba existe, false = não existe
    out.missoesTotalBruto = missaoRaw ? missaoRaw.length : 0; // total de linhas na aba, antes de filtrar

    // ---- CRONOGRAMA (opcional) ----
    // Colunas aceitas com flexibilidade de nome/acentos: NOME/ATIVIDADE, HORA INICIO,
    // HORA FIM, PRIORIDADE (1/2/3)
    const cronogramaRaw = raw["CRONOGRAMA"];
    out.cronogramaSheet = cronogramaRaw ? cronogramaRaw.map((r,idx)=>{
      const nome = trimStr(getFieldFlexible(r, ["ATIVIDADE","NOME","Nome","Atividade","Nome Atividade"]));
      const horaInicioRaw = getFieldFlexible(r, ["HORA INICIO","HORA INÍCIO","Hora Inicio","Hora Início"]);
      const horaFimRaw = getFieldFlexible(r, ["HORA FIM","Hora Fim"]);
      const prioridadeRaw = getFieldFlexible(r, ["PRIORIDADE","Prioridade"]);
      const minIni = parseTimeToMinutes(horaInicioRaw);
      const minFim = parseTimeToMinutes(horaFimRaw);
      const prioridade = Number(prioridadeRaw);
      return {
        _row: idx, nome,
        horaInicioMin: minIni, horaFimMin: minFim,
        prioridade: [1,2,3].includes(prioridade) ? prioridade : 2
      };
    }).filter(r=>r.nome && r.horaInicioMin!==null && r.horaFimMin!==null) : [];
    out.cronogramaDispo = cronogramaRaw !== null && cronogramaRaw !== undefined;

    // ---- TURNOVER (opcional) ----
    // Colunas: MATRIC/CODIGO, NOME, ATIVO, TIPO, MOTIVO, OBS, DATA CONTRATA(ÇÃO), DATA DESLIGAMENTO
    const turnoverRaw = raw["TURNOVER"];
    const DATA_INVALIDA = new Date(1900,0,1); // serial Excel 1 = 01/01/1900
    out.turnover = turnoverRaw ? turnoverRaw.map((r,i)=>{
      const matric   = trimStr(getFieldFlexible(r,["MATRIC","MATRICULA","CÓDIGO","CODIGO","COD"]));
      const nome     = trimStr(getFieldFlexible(r,["NOME","Nome"]));
      const ativoRaw = trimStr(getFieldFlexible(r,["ATIVO","Ativo"])||"");
      // Validação robusta: só considera ATIVO quando o valor normalizado (maiúsculo,
      // sem acento, sem espaços) for explicitamente "SIM"/"S"/"TRUE"/"1".
      // Qualquer variação de "Não" (NAO, Não, nao, N, FALSE, 0, vazio, etc.) é tratada
      // como inativo — não entra em nenhum módulo que dependa de r.ativo (Turnover, Férias).
      const ativoNorm = normStr(ativoRaw);
      const ativo = ["SIM","S","TRUE","1"].includes(ativoNorm);
      const tipo     = trimStr(getFieldFlexible(r,["TIPO","Tipo"])||"");
      const motivo   = trimStr(getFieldFlexible(r,["MOTIVO","Motivo"])||"");
      const obs      = trimStr(getFieldFlexible(r,["OBS","Obs","OBSERVAÇÃO","Observação"])||"");
      const dtAdmRaw = getFieldFlexible(r,["DATA CONTRATA","DATA CONTRATAÇÃO","DATA ADMISSÃO","DT ADMISSAO","DATA_ADMISSAO","Admissão","ADMISSAO"]);
      const dtDeslRaw= getFieldFlexible(r,["DATA DESLIGAMENTO","DT DESLIGAMENTO","DEMISSÃO","DESLIGAMENTO"]);
      const dtTransfRaw = getFieldFlexible(r,["DATA TRANSFERENCIA","DATA TRANSFERÊNCIA","DT TRANSFERENCIA","DATA_TRANSFERENCIA"]);

      const dtAdm  = toDate(dtAdmRaw);
      const dtDesl = toDate(dtDeslRaw);
      const dtTransf = toDate(dtTransfRaw);

      // detecta data inválida (00/01/1900 = serial 0 ou 1 no Excel → Java 1900-01-00/01)
      const dtAdmInvalida = !dtAdm || dtAdm.getFullYear()<=1900;

      if(!matric && !nome) return null;
      return {
        matric, nome, ativo, tipo, motivo, obs,
        dtAdm: dtAdmInvalida ? null : dtAdm,
        dtAdmInvalida,
        dtDesl: dtDesl && dtDesl.getFullYear()>1900 ? dtDesl : null,
        dtTransf: dtTransf && dtTransf.getFullYear()>1900 ? dtTransf : null,
        codKey: matric ? normStr(matric) : null
      };
    }).filter(Boolean) : [];
    out.turnoverDispo = turnoverRaw !== null && turnoverRaw !== undefined;

    // ---- 8457 (opcional) — item/OS, tipo 61, endereço destino (onde abastece) ----
    const raw8457 = raw["8457"];
    out.p8457 = raw8457 ? raw8457.map((r,idx)=>{
      // DATA é serial Excel — converte via toDate
      const dtinicio = toDate(getFieldFlexible(r,["DATA","DTINICIOOS","DATA INICIO"]));
      const cod  = getFieldFlexible(r,["CODFUNCOS","COD OPERADOR","CODOPERADOR"]);
      const codStr = cod!==null&&cod!==undefined ? String(cod).trim() : null;
      const nome = trimStr(getFieldFlexible(r,["NOME","Nome"]));
      // TIPOOS é string "61 - Abast. corretivo e preventivo" — detecta pelo prefixo "61"
      const tipoRaw = getFieldFlexible(r,["TIPOOS","TIPO OS","TIPO"]);
      const tipoStr = tipoRaw!==null&&tipoRaw!==undefined ? String(tipoRaw).trim() : '';
      const tipo61  = tipoStr.startsWith('61') || Number(tipoRaw)===61;
      // Endereço DESTINO (onde o produto é abastecido)
      const rua    = getFieldFlexible(r,["RUA_D","RUA DESTINO","RUA"]);
      const predio = getFieldFlexible(r,["PREDIO_D","PRÉDIO_D","PREDIO DESTINO","PREDIO"]);
      const nivel  = getFieldFlexible(r,["NIVEL_D","NÍVEL_D","NIVEL DESTINO","NIVEL"]);
      const apto   = getFieldFlexible(r,["APTO_D","APARTAMENTO_D","APTO DESTINO","APTO"]);
      // Origem (de onde sai)
      const ruaO   = getFieldFlexible(r,["RUA_O","RUA ORIGEM"]);
      const predO  = getFieldFlexible(r,["PREDIO_O","PREDIO ORIGEM"]);
      // Produto
      const qtd    = getFieldFlexible(r,["QTD","QUANTIDADE"]);
      const codProd= getFieldFlexible(r,["CODPROD","COD PROD","CODIGO PRODUTO"]);
      const descr  = trimStr(getFieldFlexible(r,["DESCRICAO","DESCRIÇÃO","DESC"])||'');
      const numos  = getFieldFlexible(r,["NUMOS","NUM OS","NROS"]);
      const codKey = codStr ? normStr(codStr) : (nome ? "NOME::"+normStr(nome) : null);
      if(!dtinicio && !codKey) return null;
      const fmtLoc = v => v!==null&&v!==undefined ? String(v).trim() : null;
      return {
        _row:idx, dtinicio, cod:codStr, nome, codKey,
        tipo61, tipoStr, numos,
        rua:fmtLoc(rua), predio:fmtLoc(predio), nivel:fmtLoc(nivel), apto:fmtLoc(apto),
        ruaO:fmtLoc(ruaO), predO:fmtLoc(predO),
        qtd: qtd!==null&&qtd!==undefined ? Number(qtd)||0 : 0,
        codProd:fmtLoc(codProd), descr
      };
    }).filter(Boolean) : [];
    out.p8457dispo = !!raw8457;

    // ---- 8022 — mapa CODPROD → {rua, depto, unidademaster} ----
    const raw8022 = raw["8022"];
    const prod2info8022 = new Map(); // CODPROD(string) → {rua, depto, unidade}
    if(raw8022){
      raw8022.forEach(r=>{
        const cp = r["CODPROD"]!==undefined&&r["CODPROD"]!==null ? String(r["CODPROD"]).trim() : null;
        if(!cp || prod2info8022.has(cp)) return;
        prod2info8022.set(cp, {
          rua:    r["RUA"]           !=null ? String(r["RUA"]).trim()            : null,
          depto:  r["DEPTO"]         !=null ? String(r["DEPTO"]).trim()          : null,
          unidade:r["UNIDADEMASTER"] !=null ? String(r["UNIDADEMASTER"]).trim()  : null,
        });
      });
    }
    out.prod2info8022 = prod2info8022;
    out.p8022dispo    = !!raw8022;

    // ---- 9712 — lançamentos filtrados por repositores do QUADRO REP ----
    const raw9712 = raw["9712"];
    const codigosRep = new Set((out.quadro||[]).map(r=>r.codigo ? String(r.codigo).trim() : null).filter(Boolean));

    // Mapa código → nome correto do QUADRO REP
    const nomeRep = new Map((out.quadro||[]).map(r=>[r.codigo, r.nome]).filter(([k,v])=>k&&v));

    out.p9712 = raw9712 ? raw9712.map((r,idx)=>{
      const funcLanc = r["Func.Lançamento"]!=null ? String(r["Func.Lançamento"]).trim() : null;
      if(!funcLanc) return null;
      const soRep = codigosRep.has(funcLanc);
      const codProd = r["Cód.Produto"]!=null ? String(r["Cód.Produto"]).trim() : null;
      const dt      = r["Data"] instanceof Date ? r["Data"] : null;
      const valorRaw = r["Valor(Total)"]!=null ? Number(r["Valor(Total)"])||0 : 0;
      const valor   = valorRaw > 0 && valorRaw <= 999999 ? valorRaw : 0;
      const numLanc = r["Num.Lançamento"]!=null ? String(r["Num.Lançamento"]).trim() : null;
      const numReg  = r["Num. Transação"]!=null ? String(r["Num. Transação"]).trim() : null;
      const descr   = r["Descrição"]  ? String(r["Descrição"]).trim()  : null;
      const motivo  = r["Motivo"]     ? String(r["Motivo"]).trim()     : null;
      const setor   = r["Setor"]      ? String(r["Setor"]).trim()      : null;
      const qtd     = r["Quantidade"] !=null ? Number(r["Quantidade"])||0 : 0;
      // Nome do repositor vem do QUADRO REP (col "Nome" na 9712 é o comprador, não o repositor)
      const nome = nomeRep.get(funcLanc) || `(Cód. ${funcLanc})`;
      const info = codProd ? (prod2info8022.get(codProd)||{}) : {};
      const isRecuperado = motivo === 'RECUPERADO (REP) STO';
      return { _row:idx, funcLanc, nome, codProd, descr, dt, valor, qtd,
               numLanc, numReg, motivo, setor, soRep, isRecuperado,
               rua: info.rua||null, depto: info.depto||null, unidade: info.unidade||null };
    }).filter(Boolean) : [];
    out.p9712dispo = !!raw9712;

    // ---- REP.AVARIA — Num.Lançamento validados pelo gestor ----
    const rawRepAvaria = raw["REP.AVARIA"];
    const numLancAvaria = new Set();
    if(rawRepAvaria){
      rawRepAvaria.forEach(r=>{
        // O header da sheet é um número (ex: 591153), então SheetJS usa esse número como chave
        // Percorre TODOS os valores da linha e pega os numéricos
        Object.values(r).forEach(v=>{
          if(v===null||v===undefined) return;
          const n = String(v).trim();
          // Só aceita números puros com 5+ dígitos (Num.Lançamento típico)
          if(/^\d{5,}$/.test(n)) numLancAvaria.add(n);
        });
      });
    }
    out.numLancAvaria = numLancAvaria;
    out.repAvariaDispo = !!rawRepAvaria;

    // ---- 8022 Nova — snapshot atualizado da capacidade ----
    const raw8022Nova = raw["8022 Nova"];
    out.p8022Nova = raw8022Nova ? raw8022Nova.map(r => {
      const cp = r["CODPROD"] != null ? String(r["CODPROD"]).trim() : null;
      if (!cp) return null;
      return {
        codprod: cp,
        descricao: r["DESCRICAO"] != null ? String(r["DESCRICAO"]).trim() : '',
        capacidade: r["CAPACIDADE"] != null ? Number(r["CAPACIDADE"]) : null,
        codendereco: r["CODENDERECO"] != null ? String(r["CODENDERECO"]).trim() : '',
        pk_end: r["PK_END"] != null ? String(r["PK_END"]).trim() : '',
        rua: r["RUA"] != null ? String(r["RUA"]).trim() : null,
        predio: r["PREDIO"] != null ? String(r["PREDIO"]).trim() : null,
        apto: r["APTO"] != null ? String(r["APTO"]).trim() : null,
        revenda: r["REVENDA"] != null ? String(r["REVENDA"]).trim().toUpperCase() : '',
        qtunitcx: Number(r["QTUNITCX"]) || 0,
      };
    }).filter(Boolean) : null;
    out.p8022NovaDispo = !!raw8022Nova;

    // ---- 8022 (full rows para Capacidade CD) — NIVEL=1 apenas ----
    const raw8022Full = raw["8022"];
    out.p8022CDRows = raw8022Full ? raw8022Full.map(r => {
      const nivel = r["NIVEL"] != null ? String(r["NIVEL"]).trim() : "";
      if (nivel !== "1") return null;
      const cp = r["CODPROD"] != null ? String(r["CODPROD"]).trim() : null;
      if (!cp) return null;
      return {
        codprod:       cp,
        descricao:     r["DESCRICAO"]     != null ? String(r["DESCRICAO"]).trim()     : "",
        codauxiliar2:  r["CODAUXILIAR2"]  != null ? String(r["CODAUXILIAR2"]).trim()  : "",
        codauxiliar:   r["CODAUXILIAR"]   != null ? String(r["CODAUXILIAR"]).trim()   : "",
        lastropal:     r["LASTROPAL"]     != null ? r["LASTROPAL"]                    : "",
        alturapal:     r["ALTURAPAL"]     != null ? r["ALTURAPAL"]                    : "",
        qttotpal:      r["QTTOTPAL"]      != null ? r["QTTOTPAL"]                     : "",
        codfornec:     r["CODFORNEC"]     != null ? String(r["CODFORNEC"]).trim()     : "",
        fornecedor:    r["FORNECEDOR"]    != null ? String(r["FORNECEDOR"]).trim()    : "",
        revenda:       r["REVENDA"]       != null ? String(r["REVENDA"]).trim()       : "",
        capacidade:    r["CAPACIDADE"]    != null ? Number(r["CAPACIDADE"])           : null,
        pontoreposicao:r["PONTOREPOSICAO"]!= null ? r["PONTOREPOSICAO"]              : "",
        pkestru:       r["PKESTRU"]       != null ? String(r["PKESTRU"]).trim()       : "",
        pk_end:        r["PK_END"]        != null ? String(r["PK_END"]).trim()        : "",
        codendereco:   r["CODENDERECO"]   != null ? String(r["CODENDERECO"]).trim()   : "",
        rua:           r["RUA"]           != null ? String(r["RUA"]).trim()           : "",
        predio:        r["PREDIO"]        != null ? String(r["PREDIO"]).trim()        : "",
        nivel:         nivel,
        apto:          r["APTO"]          != null ? String(r["APTO"]).trim()          : "",
        caracteristica:r["CARACTERISTICA"]!= null ? String(r["CARACTERISTICA"]).trim(): "",
        pulmao:        r["PULMAO"]        != null ? String(r["PULMAO"]).trim()        : "",
        tipo_1:        r["TIPO_1"]        != null ? String(r["TIPO_1"]).trim()        : "",
      };
    }).filter(Boolean) : null;
    out.p8022CDDispo = !!raw8022Full;

    // ---- Capacidade Realizada — histórico de validações ----
    const rawCapReal = raw["Capacidade Realizada"];
    out.capacidadeRealizada = rawCapReal ? rawCapReal.map(r => {
      const cod  = r["CODIGO"] != null ? String(r["CODIGO"]).trim() : null;
      if (!cod) return null;
      // Normaliza data
      let dt = null;
      if (r["DATA"] instanceof Date) {
        dt = r["DATA"];
      } else if (r["DATA"] != null) {
        const s = String(r["DATA"]).trim();
        // DD/MM/YYYY ou YYYY-MM-DD
        const m1 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m1) dt = new Date(+m1[3], +m1[2]-1, +m1[1]);
        else if (m2) dt = new Date(+m2[1], +m2[2]-1, +m2[3]);
      }
      const tipo = r["TIPO"] != null ? String(r["TIPO"]).trim().toUpperCase() : "";
      if (!["CORRETIVO","PREVENTIVO"].includes(tipo)) return null;
      return { cod, dt, tipo };
    }).filter(Boolean) : null;
    out.capacidadeRealizadaDispo = !!rawCapReal;

    // ---- Sheet "Tipo" (coluna A = CODPROD, coluna B = DATA) ----
    const rawTipo = raw["Tipo"];
    const _parseTipoDate = (v) => {
      if (!v) return null;
      // Excel serial number
      if (typeof v === 'number') {
        const d = new Date(Math.round((v - 25569) * 86400 * 1000));
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      }
      const s = String(v).trim();
      const m1 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      const m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m1) return new Date(+m1[3], +m1[2]-1, +m1[1]);
      if (m2) return new Date(+m2[1], +m2[2]-1, +m2[3]);
      return null;
    };
    out.sheetTipo = rawTipo ? rawTipo.map(r => {
      // A aba pode ter headers nomeados ou não — tenta múltiplas variações
      const codKeys = Object.keys(r).filter(k => k === '__EMPTY' || k.match(/^CODPROD$/i) || k.match(/^A$/i) || k.match(/^COD/i));
      const dtKeys  = Object.keys(r).filter(k => k.match(/^DATA$/i) || k.match(/^B$/i) || k.match(/^DATE$/i));
      // Fallback: SheetJS coloca colunas sem header como __EMPTY, __EMPTY_1 etc.
      const allKeys = Object.keys(r);
      const cod = codKeys.length > 0 ? r[codKeys[0]] : (allKeys.length > 0 ? r[allKeys[0]] : null);
      const dtRaw = dtKeys.length > 0 ? r[dtKeys[0]] : (allKeys.length > 1 ? r[allKeys[1]] : null);
      const cp = cod != null ? String(cod).trim() : null;
      if (!cp || cp === 'CODPROD') return null; // pula header
      const dt = _parseTipoDate(dtRaw);
      return { codprod: cp, dt };
    }).filter(Boolean) : null;
    out.sheetTipoDispo = !!rawTipo && rawTipo.length > 0;

    return out;
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Current Team                                                    */
/* ---------------------------------------------------------------------- */
const CurrentTeam = {
  compute(processed){
    const quadro = processed.quadro;
    if(!quadro.length) return { date:null, codes:new Set(), members:[], cargoDisponivel:false, cargoCounts:{}, repositorCodes:new Set() };
    let maxTime = Math.max(...quadro.map(r=>r.data.getTime()));
    const maxDate = new Date(maxTime);
    const rowsAtMax = quadro.filter(r=>r.data.getTime()===maxTime);
    const map = new Map();
    rowsAtMax.forEach(r=>{ map.set(r.codKey, r); });
    let members = Array.from(map.values());

    // O quadro atual é quem está ATIVO = Sim na aba TURNOVER (a chamada só registra presença/falta).
    // Só vale quando a aba existe e tem ao menos um ativo — senão mantém o comportamento antigo.
    const ativosT = (processed.turnover||[]).filter(t=>t.ativo && t.codKey);
    if(processed.turnoverDispo && ativosT.length){
      const ativoKeys = new Set(ativosT.map(t=>t.codKey));
      members = members.filter(m=>ativoKeys.has(m.codKey));
      const ultimoPorCod = new Map();
      quadro.forEach(r=>{ const a = ultimoPorCod.get(r.codKey); if(!a || r.data>=a.data) ultimoPorCod.set(r.codKey, r); });
      ativosT.forEach(t=>{
        if(members.some(m=>m.codKey===t.codKey)) return;
        const ult = ultimoPorCod.get(t.codKey);
        members.push({ _row:-1, data:maxDate, codigo:t.matric, nome:t.nome, codKey:t.codKey, statusRaw:"", bucket:"OUTRO",
                       cargo: ult?ult.cargo:null, cargoRaw: ult?ult.cargoRaw:"", semChamada:true });
      });
    }

    const cargoDisponivel = !!processed.cargoDisponivel;
    const cargoCounts = { LIDER:0, AUXILIAR:0, REPOSITOR:0, OUTRO:0, NAO_INFORMADO:0 };
    members.forEach(m=>{
      if(!cargoDisponivel || m.cargo===null) cargoCounts.NAO_INFORMADO++;
      else cargoCounts[m.cargo] = (cargoCounts[m.cargo]||0)+1;
    });

    // Repositores "de verdade": se a coluna CARGO existe, considera só quem está marcado
    // como REPOSITOR. Se a coluna não existir no arquivo, mantém o comportamento antigo
    // (todo mundo do quadro atual conta como repositor) para não quebrar arquivos antigos.
    const repositorCodes = cargoDisponivel
      ? new Set(members.filter(m=>m.cargo==="REPOSITOR").map(m=>m.codKey))
      : new Set(members.map(m=>m.codKey));

    return {
      date: maxDate,
      codes: new Set(members.map(m=>m.codKey)),
      members,
      cargoDisponivel, cargoCounts, repositorCodes
    };
  }
};

/* ---------------------------------------------------------------------- */
/* NAME / CODE registry (para exibição consistente em toda a aplicação)    */
/* ---------------------------------------------------------------------- */
function buildNameRegistry(processed){
  const registry = new Map(); // codKey -> display name
  const feed = [processed.quadro, processed.p8460, processed.auditoria, processed.feedback];
  feed.forEach(arr=>{
    arr.forEach(r=>{
      if(r.codKey && r.nome && !registry.has(r.codKey)){
        registry.set(r.codKey, r.nome);
      }
    });
  });
  return registry;
}

/* ---------------------------------------------------------------------- */
/* MODULE: Production (fonte: 8460, TIPOOS = 58, data = DTFIMSEPARACAO)     */
/* ---------------------------------------------------------------------- */
const Production = {
  state: {
    mode: "mes",              // dia | semana | mes
    dataInicial: null,
    dataFinal: null,
    employees: [],            // codKeys selecionados (vazio = todos)
    quadroAtual: "NAO",
    weekCompareMode: "anterior", // anterior | mesCorrespondente
    mesmaPeriodicidade: "SIM",
    projectionBase: 1,
    dailyChartMes: 1  // 0=mês atual, 1=mês anterior (mês fechado) — usado só no gráfico Produção Diária
  },

  getBaseRows(){
    const processed = window.APP_STATE.processed;
    let rows = processed.p8460.filter(r=>r.tipoos===58);
    if(this.state.quadroAtual==="SIM"){
      const codes = window.APP_STATE.currentTeam.codes;
      rows = rows.filter(r=>codes.has(r.codKey));
    }
    if(this.state.employees.length){
      const set = new Set(this.state.employees);
      rows = rows.filter(r=>set.has(r.codKey));
    }
    return rows;
  },

  // aplica filtro de intervalo de datas (para tabelas/gráficos filtráveis)
  getFilteredRows(){
    let rows = this.getBaseRows();
    if(this.state.dataInicial){
      const di = dateOnly(this.state.dataInicial);
      rows = rows.filter(r=>dateOnly(r.dtinicio) >= di);
    }
    if(this.state.dataFinal){
      const df = dateOnly(this.state.dataFinal);
      rows = rows.filter(r=>dateOnly(r.dtinicio) <= df);
    }
    return rows;
  },

  countByDay(rows){
    const map = new Map();
    rows.forEach(r=>{
      const k = ymdKey(r.dtinicio);
      map.set(k, (map.get(k)||0)+1);
    });
    return map;
  },
  countByMonth(rows){
    const map = new Map();
    rows.forEach(r=>{
      const k = ymKey(r.dtinicio);
      map.set(k, (map.get(k)||0)+1);
    });
    return map;
  },

  availableMonths(){
    const rows = this.getBaseRows();
    const set = new Set(rows.map(r=>ymKey(r.dtinicio)));
    return Array.from(set).sort();
  },
  availableYears(){
    const rows = this.getBaseRows();
    return uniq(rows.map(r=>r.dtinicio.getFullYear())).sort();
  },
  maxDataDate(){
    const rows = this.getBaseRows();
    if(!rows.length) return null;
    return new Date(Math.max(...rows.map(r=>r.dtinicio.getTime())));
  },

  // ----- Visão executiva automática (independe de filtros de data) -----
  executiveSummary(){
    const rows = this.getBaseRows();
    if(!rows.length) return null;
    const maxDate = this.maxDataDate();
    const refYear = maxDate.getFullYear(), refMonth = maxDate.getMonth();
    const diaCorte = maxDate.getDate();
    const mp = this.state.mesmaPeriodicidade === "SIM";

    const curMonthRows = rows.filter(r=> r.dtinicio.getFullYear()===refYear && r.dtinicio.getMonth()===refMonth);
    const prevMonthDate = addMonths(new Date(refYear, refMonth, 1), -1);
    let prevMonthRows = rows.filter(r=> r.dtinicio.getFullYear()===prevMonthDate.getFullYear() && r.dtinicio.getMonth()===prevMonthDate.getMonth());
    if(mp){
      // corta o mês anterior no mesmo dia do mês atual, para comparar períodos equivalentes
      const ultimoDiaPrevMes = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth()+1, 0).getDate();
      const diaCortePrev = Math.min(diaCorte, ultimoDiaPrevMes);
      prevMonthRows = prevMonthRows.filter(r=> r.dtinicio.getDate() <= diaCortePrev);
    }

    const totalAtual = curMonthRows.length;
    const totalAnterior = prevMonthRows.length;
    const variacao = pctVariation(totalAtual, totalAnterior);

    // média diária considera apenas dias úteis (Seg-Sex) — a empresa não trabalha fim de semana
    const curMonthRowsUteis = curMonthRows.filter(r=>isWeekday(r.dtinicio));
    const diasComDados = uniq(curMonthRowsUteis.map(r=>ymdKey(r.dtinicio))).length || 1;
    const mediaDiaria = curMonthRowsUteis.length / diasComDados;

    const totalDiasMesCalendario = new Date(refYear, refMonth+1, 0).getDate();
    const totalDiasMes = countWeekdaysInMonth(refYear, refMonth); // dias ÚTEIS do mês — usado nos cálculos
    const diaAtualDoMes = maxDate.getDate();

    // projeção UNIFICADA: usa a mesma lógica/base de Production.projection()
    // (média dos N meses anteriores, conforme filtro "Base" selecionado pelo usuário)
    const proj = this.projection();
    const projecao = proj ? proj.projecao : mediaDiaria * totalDiasMes;
    const projecaoBaseLabel = proj ? proj.baseMeses.join(", ") : null;
    const projecaoMaior = proj ? proj.projecaoMaior : null;

    // variação anual: mesmo mês ano anterior (também respeita mesma periodicidade)
    let prevYearRows = rows.filter(r=> r.dtinicio.getFullYear()===refYear-1 && r.dtinicio.getMonth()===refMonth);
    if(mp){
      const ultimoDiaPrevAno = new Date(refYear-1, refMonth+1, 0).getDate();
      const diaCortePrevAno = Math.min(diaCorte, ultimoDiaPrevAno);
      prevYearRows = prevYearRows.filter(r=> r.dtinicio.getDate() <= diaCortePrevAno);
    }
    const totalAnoAnterior = prevYearRows.length;
    const variacaoAnual = pctVariation(totalAtual, totalAnoAnterior);

    return {
      refYear, refMonth, maxDate,
      totalAtual, totalAnterior, variacao,
      mediaDiaria, diasComDados, totalDiasMes, totalDiasMesCalendario, diaAtualDoMes,
      projecao, projecaoBaseLabel, projecaoMaior,
      totalAnoAnterior, variacaoAnual,
      mesmaPeriodicidadeAtiva: mp, diaCorte
    };
  },

  monthlyEvolution(){
    return this.monthlyEvolutionWithPeriod(null);
  },

  // Se refDate fornecido: cada mês é cortado no mesmo dia do mês (mesma periodicidade)
  monthlyEvolutionWithPeriod(refDate){
    const rows = this.getBaseRows();
    // quais meses existem?
    const allKeys = Array.from(new Set(rows.map(r=>ymKey(r.dtinicio)))).sort();
    return allKeys.map((k,i)=>{
      const y = Math.floor(k/100), m = (k%100)-1;
      // corta no dia refDate.getDate() se mesma periodicidade e este é o mês atual
      let rowsForMonth;
      if(refDate && y===refDate.getFullYear() && m===refDate.getMonth()){
        const cutoff = dateOnly(refDate);
        rowsForMonth = rows.filter(r=> ymKey(r.dtinicio)===k && dateOnly(r.dtinicio)<=cutoff);
      } else if(refDate){
        // meses anteriores: cortar no mesmo dia do mês para comparação justa
        const diaCorte = refDate.getDate();
        const ultimoDiaMes = new Date(y,m+1,0).getDate();
        const dia = Math.min(diaCorte, ultimoDiaMes);
        const cutoff = new Date(y,m,dia);
        rowsForMonth = rows.filter(r=> ymKey(r.dtinicio)===k && dateOnly(r.dtinicio)<=cutoff);
      } else {
        rowsForMonth = rows.filter(r=> ymKey(r.dtinicio)===k);
      }
      const total = rowsForMonth.length;
      const prevKey = i>0 ? allKeys[i-1] : null;
      let prevTotal = null;
      if(prevKey!==null){
        const py = Math.floor(prevKey/100), pm=(prevKey%100)-1;
        let prevRows;
        if(refDate){
          const diaCorte = refDate.getDate();
          const ultimoDia = new Date(py,pm+1,0).getDate();
          const dia = Math.min(diaCorte, ultimoDia);
          prevRows = rows.filter(r=> ymKey(r.dtinicio)===prevKey && dateOnly(r.dtinicio)<=new Date(py,pm,dia));
        } else {
          prevRows = rows.filter(r=> ymKey(r.dtinicio)===prevKey);
        }
        prevTotal = prevRows.length;
      }
      const diasUteisNoMes = uniq(rowsForMonth.filter(r=>isWeekday(r.dtinicio)).map(r=>ymdKey(r.dtinicio))).length || 1;
      const totalUtil = rowsForMonth.filter(r=>isWeekday(r.dtinicio)).length;
      return {
        year:y, month:m, label: fmtMonthYear(y,m), total,
        prevTotal, diff: prevTotal!==null ? total-prevTotal : null,
        variacao: prevTotal!==null ? pctVariation(total, prevTotal) : null,
        mediaDiaria: totalUtil/diasUteisNoMes,
        periodoLabel: refDate ? `até dia ${Math.min(refDate.getDate(), new Date(y,m+1,0).getDate())}` : null
      };
    });
  },

  monthlyComparisonTable(){
    return this.monthlyEvolution();
  },

  yearComparison(years){
    const rows = this.getBaseRows();
    const allYears = this.availableYears();
    const sel = (years && years.length) ? years : allYears.slice(-2);
    const byYearMonth = new Map();
    rows.forEach(r=>{
      const y = r.dtinicio.getFullYear(), m = r.dtinicio.getMonth();
      const k = y+"_"+m;
      byYearMonth.set(k, (byYearMonth.get(k)||0)+1);
    });
    const table = [];
    for(let m=0;m<12;m++){
      const row = { month:m, label: MESES_PT[m], values:{} };
      sel.forEach(y=>{ row.values[y] = byYearMonth.get(y+"_"+m) || 0; });
      table.push(row);
    }
    return { years: sel, allYears, table };
  },

  ytd(){
    const rows = this.getBaseRows();
    const maxDate = this.maxDataDate();
    if(!maxDate) return null;
    const y = maxDate.getFullYear();
    const start = new Date(y,0,1);
    const end = maxDate;
    const startPrev = new Date(y-1,0,1);
    const endPrev = new Date(y-1, maxDate.getMonth(), maxDate.getDate());

    const atual = rows.filter(r=> r.dtinicio>=start && dateOnly(r.dtinicio)<=dateOnly(end)).length;
    const anterior = rows.filter(r=> r.dtinicio>=startPrev && dateOnly(r.dtinicio)<=dateOnly(endPrev)).length;
    return {
      ano: y, anoAnterior: y-1,
      periodoAtual: `${fmtDateBR(start)} — ${fmtDateBR(end)}`,
      periodoAnterior: `${fmtDateBR(startPrev)} — ${fmtDateBR(endPrev)}`,
      atual, anterior, diff: atual-anterior, variacao: pctVariation(atual, anterior)
    };
  },

  dailySeries(){
    const rows = this.getFilteredRows();
    const byDay = this.countByDay(rows);
    const keys = Array.from(byDay.keys()).sort();
    const vals = keys.map(k=>byDay.get(k));
    const media = avg(vals);
    return keys.map(k=>{
      const y = Math.floor(k/10000), m = Math.floor((k%10000)/100)-1, d = k%100;
      return { date:new Date(y,m,d), total: byDay.get(k), media };
    });
  },

  // Série diária usada especificamente no gráfico "Produção Diária" — independente
  // do filtro Data Inicial/Data Final do painel. state.dailyChartMes escolhe qual mês
  // mostrar: 0 = mês atual (dia 1 até hoje), 1 = mês anterior (mês fechado, completo).
  // Preenche todos os dias do intervalo (mesmo sem produção) para o eixo ficar completo.
  dailySeriesForChart(){
    const opt = this.state.dailyChartMes===0 ? 0 : 1;
    const hoje = this.maxDataDate() || new Date();
    const y = hoje.getFullYear(), m = hoje.getMonth();
    const targetM = opt===0 ? m : m-1;
    const ini = dateOnly(new Date(y, targetM, 1));
    const fim = opt===0 ? dateOnly(hoje) : dateOnly(new Date(y, targetM+1, 0));
    const rows = this.getBaseRows().filter(r=>{ const d=dateOnly(r.dtinicio); return d>=ini && d<=fim; });
    const byDay = this.countByDay(rows);
    const vals = Array.from(byDay.values());
    const media = vals.length ? avg(vals) : 0;
    const out = [];
    let cur = new Date(ini);
    while(cur<=fim){
      const k = ymdKey(cur);
      out.push({ date:new Date(cur), total: byDay.get(k)||0, media });
      cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()+1);
    }
    return out;
  },

  weeklyTable(){
    const rows = this.getBaseRows();
    const byWeek = new Map();
    rows.forEach(r=>{
      const wow = weekOfYearMonday(r.dtinicio);
      const k = wow.year*100+wow.week;
      if(!byWeek.has(k)) byWeek.set(k, { year:wow.year, week:wow.week, weekKey:k, start:startOfWeekMonday(r.dtinicio), count:0 });
      byWeek.get(k).count++;
    });
    const keys = Array.from(byWeek.keys()).sort();
    return keys.map((k,i)=>{
      const cur = byWeek.get(k);
      const prev = i>0 ? byWeek.get(keys[i-1]) : null;
      return {
        weekKey: k,
        label: `Sem ${cur.week}/${cur.year} (${fmtDateBR(cur.start)})`,
        start: cur.start,
        total: cur.count,
        anterior: prev ? prev.count : null,
        anteriorStart: prev ? prev.start : null,
        anteriorWeekKey: prev ? prev.weekKey : null,
        diff: prev ? cur.count-prev.count : null,
        variacao: prev ? pctVariation(cur.count, prev.count) : null
      };
    });
  },

  // Retorna breakdown dia a dia (Seg-Sex) de uma semana vs semana anterior
  // Projeta o valor de um dia que ainda não ocorreu: média de todas as ocorrências
  // anteriores desse mesmo dia da semana dentro do mesmo mês (dados reais, até o
  // momento). Ex: para projetar uma quarta-feira, usa a média das quartas já
  // ocorridas neste mês. Retorna null se não houver nenhuma ocorrência anterior.
  projectedValueForWeekday(date){
    const rows = this.getBaseRows();
    const maxDate = this.maxDataDate();
    const y = date.getFullYear(), m = date.getMonth(), dow = date.getDay();
    const totalDiasMes = new Date(y, m+1, 0).getDate();
    const occurrences = [];
    for(let d=1; d<=totalDiasMes; d++){
      const dt = new Date(y,m,d);
      if(dt.getDay()!==dow) continue;
      if(dateOnly(dt).getTime()===dateOnly(date).getTime()) continue; // não conta o próprio dia
      if(!maxDate || dateOnly(dt) > dateOnly(maxDate)) continue; // só conta ocorrências já passadas
      const cnt = rows.filter(r=> dateOnly(r.dtinicio).getTime()===dateOnly(dt).getTime()).length;
      occurrences.push(cnt);
    }
    if(!occurrences.length) return null;
    return avg(occurrences);
  },

  weeklyDayBreakdown(weekKey, anteriorWeekKey){
    const rows = this.getBaseRows();
    const DIAS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
    // encontra a segunda-feira da semana pelo weekKey
    function getWeekStart(wk){
      const y = Math.floor(wk/100);
      // busca qualquer row dessa semana para pegar a data de início
      const r = rows.find(r=>{ const wow=weekOfYearMonday(r.dtinicio); return wow.year*100+wow.week===wk; });
      return r ? startOfWeekMonday(r.dtinicio) : null;
    }
    const start  = getWeekStart(weekKey);
    const startP = anteriorWeekKey ? getWeekStart(anteriorWeekKey) : null;
    if(!start) return [];

    const maxDate = this.maxDataDate();

    // conta OS por dia da semana para a semana atual e anterior
    const countByDate = new Map();
    rows.forEach(r=>{
      const d = dateOnly(r.dtinicio);
      const t = d.getTime();
      countByDate.set(t, (countByDate.get(t)||0)+1);
    });

    const result = [];
    for(let offset=0; offset<7; offset++){
      const dataCur  = addDays(start,  offset);
      const dataPrev = startP ? addDays(startP, offset) : null;
      const dow = dataCur.getDay(); // 0=dom, 1=seg … 6=sab
      const diaNome = DIAS[(dow+6)%7]; // converte: seg=0…dom=6
      if(dow===0 || dow===6) continue; // pula domingo e sábado — empresa trabalha só Seg-Sex

      const occurred = maxDate ? dateOnly(dataCur) <= dateOnly(maxDate) : false;
      const totalCur = countByDate.get(dataCur.getTime()) || 0;
      const projetado = occurred ? null : this.projectedValueForWeekday(dataCur);

      result.push({
        diaNome, dataCur, occurred,
        totalCur: occurred ? totalCur : null, // só preenche "feito" quando o dia já passou
        projetado,
        dataPrev, totalPrev: dataPrev ? (countByDate.get(dataPrev.getTime()) || 0) : null
      });
    }
    return result;
  },

  topPeriods(n){
    n = n||3;
    const daily = this.dailySeries().filter(d=>d.total>0);
    const sorted = [...daily].sort((a,b)=>b.total-a.total);
    const top = sorted.slice(0,n);
    const bottom = [...daily].sort((a,b)=>a.total-b.total).slice(0,n);
    return { top, bottom };
  },

  // ----- Comparações do modo de filtro (Dia/Semana/Mês) -----
  modeComparison(){
    const rows = this.getBaseRows();
    const mode = this.state.mode;
    const refDate = this.state.dataFinal ? dateOnly(this.state.dataFinal) : dateOnly(this.maxDataDate());
    if(!refDate) return null;

    if(mode==="dia"){
      const target = this.state.dataInicial ? dateOnly(this.state.dataInicial) : refDate;
      const prevWeekSameDay = addDays(target, -7);
      const cAtual = rows.filter(r=> dateOnly(r.dtinicio).getTime()===target.getTime()).length;
      const cAnterior = rows.filter(r=> dateOnly(r.dtinicio).getTime()===prevWeekSameDay.getTime()).length;
      return {
        mode,
        labelAtual: `${DIAS_SEMANA_PT[target.getDay()]}, ${fmtDateBR(target)}`,
        labelAnterior: `${DIAS_SEMANA_PT[prevWeekSameDay.getDay()]}, ${fmtDateBR(prevWeekSameDay)}`,
        atual:cAtual, anterior:cAnterior, variacao: pctVariation(cAtual,cAnterior)
      };
    }
    if(mode==="semana"){
      const startCur = startOfWeekMonday(refDate);
      const endCur = addDays(startCur,6);
      let startCmp, endCmp, labelCmp;
      if(this.state.weekCompareMode==="mesCorrespondente"){
        startCmp = addMonths(startCur,-1); endCmp = addDays(startCmp,6);
        labelCmp = `Semana correspondente do mês anterior (${fmtDateBR(startCmp)} - ${fmtDateBR(endCmp)})`;
      } else {
        startCmp = addDays(startCur,-7); endCmp = addDays(startCmp,6);
        labelCmp = `Semana anterior (${fmtDateBR(startCmp)} - ${fmtDateBR(endCmp)})`;
      }
      const cAtual = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startCur && d<=endCur; }).length;
      const cAnterior = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startCmp && d<=endCmp; }).length;
      return {
        mode,
        labelAtual: `Semana atual (${fmtDateBR(startCur)} - ${fmtDateBR(endCur)})`,
        labelAnterior: labelCmp,
        atual:cAtual, anterior:cAnterior, variacao: pctVariation(cAtual,cAnterior)
      };
    }
    // mes
    const y = refDate.getFullYear(), m = refDate.getMonth();
    let startCur, endCur, startCmp, endCmp;
    if(this.state.mesmaPeriodicidade==="SIM"){
      startCur = new Date(y,m,1); endCur = refDate;
      const pm = addMonths(new Date(y,m,1),-1);
      startCmp = new Date(pm.getFullYear(), pm.getMonth(), 1);
      endCmp = new Date(pm.getFullYear(), pm.getMonth(), Math.min(refDate.getDate(), new Date(pm.getFullYear(),pm.getMonth()+1,0).getDate()));
    } else {
      startCur = new Date(y,m,1); endCur = new Date(y,m+1,0);
      const pm = addMonths(new Date(y,m,1),-1);
      startCmp = new Date(pm.getFullYear(), pm.getMonth(), 1);
      endCmp = new Date(pm.getFullYear(), pm.getMonth()+1, 0);
    }
    const cAtual = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startCur && d<=endCur; }).length;
    const cAnterior = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startCmp && d<=endCmp; }).length;
    return {
      mode,
      labelAtual: `${fmtMonthYear(y,m)} (${fmtDateBR(startCur)} - ${fmtDateBR(endCur)})`,
      labelAnterior: `${fmtMonthYear(startCmp.getFullYear(), startCmp.getMonth())} (${fmtDateBR(startCmp)} - ${fmtDateBR(endCmp)})`,
      atual:cAtual, anterior:cAnterior, variacao: pctVariation(cAtual,cAnterior)
    };
  },

  // projeção baseada em média de N meses anteriores — retorna dados completos para gráfico
  projection(){
    const evo = this.monthlyEvolutionWithPeriod(null); // usa meses completos como base
    if(!evo.length) return null;
    const n = this.state.projectionBase;

    // mês atual = último da série
    const last = evo[evo.length-1];
    const totalDiasMesCalendario = new Date(last.year, last.month+1, 0).getDate();
    const totalDiasMes = countWeekdaysInMonth(last.year, last.month); // dias ÚTEIS do mês

    let mediaBase, baseMeses, avisoHistoricoInsuficiente;

    if(n === 0){
      // "Mês Atual": base = média diária real dos dias já passados neste mês
      // (igual ao que a aba Produção já exibe no card "Média Diária")
      mediaBase = last.mediaDiaria;
      baseMeses = [last.label + " (mês atual)"];
      avisoHistoricoInsuficiente = null;
    } else {
      // meses de base = os N meses imediatamente anteriores ao atual
      const base = evo.slice(Math.max(0, evo.length-1-n), evo.length-1);
      mediaBase = base.length ? avg(base.map(b=>b.mediaDiaria)) : last.mediaDiaria;
      baseMeses = base.map(b=>b.label);
      avisoHistoricoInsuficiente = base.length < n
        ? `Foram utilizados apenas ${base.length} mês(es) de histórico (solicitado: ${n}). Carregue arquivos com mais histórico para usar ${n} meses como base.`
        : null;
    }

    const projecao = mediaBase * totalDiasMes;
    const mediaDiariaAtual = last.mediaDiaria;
    // Verde quando o ritmo atual >= média base histórica
    const projecaoMaior = mediaDiariaAtual >= mediaBase;

    // serie diária do mês atual (dados reais) — mostra todos os dias corridos (inclusive fins de
    // semana, para contexto visual), mas a projeção só avança em dias úteis
    const rows = this.getBaseRows();
    const y = last.year, m = last.month;
    const diasReais = [];
    for(let d=1; d<=totalDiasMesCalendario; d++){
      const dt = new Date(y,m,d);
      const cnt = rows.filter(r=> r.dtinicio.getFullYear()===y && r.dtinicio.getMonth()===m && r.dtinicio.getDate()===d).length;
      diasReais.push({ dia:d, date:dt, util:isWeekday(dt), real: cnt>0||d<=last.total/last.mediaDiaria ? cnt : null });
    }
    // acumulado real
    let acum = 0;
    diasReais.forEach(d=>{ if(d.real!==null){ acum+=d.real; d.acumReal=acum; } else { d.acumReal=null; } });
    // projeção acumulada dia a dia — só soma a média base nos dias úteis; fica "achatada" no fim de semana
    let acumProj = 0;
    diasReais.forEach(d=>{
      if(d.util) acumProj += mediaBase;
      d.acumProj = +acumProj.toFixed(0);
    });
    // último dia real conhecido
    const ultimoDiaReal = last.total; // total acumulado real do mês atual
    const ultimoDia = (() => {
      const realRows = rows.filter(r=>r.dtinicio.getFullYear()===y && r.dtinicio.getMonth()===m);
      if(!realRows.length) return 0;
      return Math.max(...realRows.map(r=>r.dtinicio.getDate()));
    })();

    // projeção por funcionário no mês atual
    const empMap = new Map();
    rows.filter(r=>r.dtinicio.getFullYear()===y && r.dtinicio.getMonth()===m).forEach(r=>{
      if(!empMap.has(r.codKey)) empMap.set(r.codKey, { codKey:r.codKey, nome: window.APP_STATE.nameRegistry.get(r.codKey)||r.nome, totalAtual:0 });
      empMap.get(r.codKey).totalAtual++;
    });
    const empProj = Array.from(empMap.values()).map(e=>{
      const mediaDiariaEmp = this.employeeDailyAverage(e.codKey);
      return { ...e, mediaDiariaEmp, projecaoFechamento: +(mediaDiariaEmp * totalDiasMes).toFixed(0) };
    }).sort((a,b)=>b.projecaoFechamento-a.projecaoFechamento);

    return {
      baseMeses,
      mesesDisponiveisBase: baseMeses.length,
      mesesSolicitados: n,
      mediaBase, projecao, mediaDiariaAtual, totalDiasMes, totalDiasMesCalendario,
      mesAtual: last.label, projecaoMaior,
      ultimoDia, ultimoDiaReal,
      diasReais, empProj,
      avisoHistoricoInsuficiente
    };
  },

  // Média diária de O.S. 58 do colaborador no mês corrente, considerando apenas dias
  // úteis (Seg-Sex) tanto na produção quanto no denominador de dias. Usada pela
  // Projeção por Funcionário.
  employeeDailyAverage(codKey){
    const rows = this.getBaseRows();
    const maxDate = this.maxDataDate();
    if(!maxDate) return 0;
    const y = maxDate.getFullYear(), m = maxDate.getMonth();
    const monthRows = rows.filter(r=>r.dtinicio.getFullYear()===y && r.dtinicio.getMonth()===m);
    const ultimoDiaNum = monthRows.length ? Math.max(...monthRows.map(r=>r.dtinicio.getDate())) : 0;
    const diasUteisTrabalhados = ultimoDiaNum ? countWeekdaysUpToDay(y, m, ultimoDiaNum) : 1;
    const totalAtual = monthRows.filter(r=>r.codKey===codKey && isWeekday(r.dtinicio)).length;
    return totalAtual / (diasUteisTrabalhados || 1);
  },

  // Média diária de O.S. 58 do colaborador considerando TODO o histórico dele na 8460
  // (não só o mês atual), apenas dias úteis. Usada especificamente no cálculo de
  // Missões, conforme pedido: "média que este colaborador produz ao longo de todo
  // seu histórico na 8460".
  employeeHistoricalDailyAverage(codKey){
    const rows = window.APP_STATE.processed.p8460.filter(r=>r.tipoos===58 && r.codKey===codKey && isWeekday(r.dtinicio));
    if(!rows.length) return 0;
    const diasTrabalhados = uniq(rows.map(r=>ymdKey(r.dtinicio))).length || 1;
    return rows.length / diasTrabalhados;
  },

  // (mantida por compatibilidade — mesmo cálculo de employeeHistoricalDailyAverage)
  employeeAllTimeDailyAverage(codKey){
    return this.employeeHistoricalDailyAverage(codKey);
  },

  employeeRanking(){
    const rows = this.getBaseRows();
    const registry = window.APP_STATE.nameRegistry;
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.codKey)) map.set(r.codKey, { codKey:r.codKey, nome: registry.get(r.codKey)||r.nome, total:0 });
      map.get(r.codKey).total++;
    });
    return Array.from(map.values()).sort((a,b)=>b.total-a.total);
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Projection (fonte: 8271)                                        */
/* ---------------------------------------------------------------------- */
const Projection = {
  state: { dataInicial:null, dataFinal:null },

  getRows(){
    const processed = window.APP_STATE.processed;
    let rows = processed.p8271;
    if(this.state.dataInicial){
      const di = dateOnly(this.state.dataInicial);
      rows = rows.filter(r=>dateOnly(r.data) >= di);
    }
    if(this.state.dataFinal){
      const df = dateOnly(this.state.dataFinal);
      rows = rows.filter(r=>dateOnly(r.data) <= df);
    }
    return rows;
  },

  // ---- TIPOOS 61 por rua ----
  ruas61(){
    const rows = this.getRows().filter(r=>r.tipoos===61 && r.rua!==null && !isNaN(r.rua));
    const allRuas = uniq(this.getRows().filter(r=>r.rua!==null && !isNaN(r.rua)).map(r=>r.rua)).sort((a,b)=>a-b);
    const map = new Map();
    allRuas.forEach(ru=>map.set(ru,0));
    rows.forEach(r=>{ map.set(r.rua, (map.get(r.rua)||0)+1); });
    const arr = Array.from(map.entries()).map(([rua,count])=>({rua,count}));
    return arr.sort((a,b)=>a.rua-b.rua);
  },
  cards61(){
    const data = this.ruas61();
    const total = sum(data.map(d=>d.count));
    const comOcorrencia = data.filter(d=>d.count>0);
    const maior = data.reduce((m,d)=> d.count>(m?m.count:-1) ? d : m, null);
    return {
      total,
      ruasCom61: comOcorrencia.length,
      mediaPorRua: comOcorrencia.length ? total/comOcorrencia.length : 0,
      maiorDemanda: maior
    };
  },

  // ---- TIPOOS 58 ----
  os58Groups(){
    // agrupa por NUMOS para encontrar a data mais antiga de cada OS
    const rows = this.getRows().filter(r=>r.tipoos===58);
    const map = new Map();
    rows.forEach(r=>{
      const key = r.numos;
      if(!map.has(key)) map.set(key, { numos:key, firstDate:r.data, rua:r.rua, rows:[] });
      const g = map.get(key);
      if(r.data < g.firstDate) g.firstDate = r.data;
      g.rows.push(r);
    });
    return Array.from(map.values());
  },
  cards58(){
    const groups = this.os58Groups();
    const maxDate = this.maxDataDate();
    const hoje = maxDate ? dateOnly(maxDate) : null;
    const ontem = hoje ? addDays(hoje,-1) : null;

    // 58 com 2+ dias = OS cujo PRIMEIRO registro é ANTERIOR ao dia anterior
    // (ou seja: ficou na fila sem ser finalizada na 8460 por pelo menos 2 dias)
    const doisOuMaisDias = ontem
      ? groups.filter(g=> dateOnly(g.firstDate) < ontem)
      : [];

    // contagem por dia
    const allRows = groups.flatMap(g=>g.rows);
    const doDiaHoje  = hoje  ? allRows.filter(r=>dateOnly(r.data).getTime()===hoje.getTime()).length  : 0;
    const doDiaAnterior = ontem ? allRows.filter(r=>dateOnly(r.data).getTime()===ontem.getTime()).length : 0;

    return {
      total: allRows.length,
      doisOuMaisDias: doisOuMaisDias.length,
      doisOuMaisDiasDetalhe: doisOuMaisDias.slice(0,10), // para eventual detalhe
      doDiaAnterior, doDiaHoje, hoje, ontem
    };
  },
  os58PorRua(){
    const rows = this.getRows().filter(r=>r.tipoos===58 && r.rua!==null && !isNaN(r.rua));
    const map = new Map();
    rows.forEach(r=>{ map.set(r.rua, (map.get(r.rua)||0)+1); });
    return Array.from(map.entries()).map(([rua,count])=>({rua,count})).sort((a,b)=>a.rua-b.rua);
  },
  maxDataDate(){
    const rows = this.getRows();
    if(!rows.length) return null;
    return new Date(Math.max(...rows.map(r=>r.data.getTime())));
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Feedback (fonte: FEEDBACK REP)                                  */
/* ---------------------------------------------------------------------- */
const Feedback = {
  classify(nota){
    if(nota===null||nota===undefined) return null;
    if(nota<=3) return { label:"Desempenho insatisfatório", cls:"neg" };
    if(nota<=6) return { label:"Regular — margem para melhoria", cls:"warn" };
    return { label:"Bom desempenho", cls:"pos" };
  },
  byEmployee(){
    const processed = window.APP_STATE.processed;
    const registry = window.APP_STATE.nameRegistry;
    const map = new Map();
    processed.feedback.forEach(r=>{
      const key = r.codKey || "SEMCOD::"+r.nome;
      if(!map.has(key)) map.set(key, {
        codKey:key, nome: registry.get(r.codKey)||r.nome, feedbacks:0, advertencias:0,
        somaPessoal:0, nPessoal:0, somaGestor:0, nGestor:0, registros:[]
      });
      const e = map.get(key);
      e.feedbacks++;
      if(r.isAdvertencia) e.advertencias++;
      if(r.avPessoal!==null){ e.somaPessoal+=r.avPessoal; e.nPessoal++; }
      if(r.avGestor!==null){ e.somaGestor+=r.avGestor; e.nGestor++; }
      e.registros.push(r);
    });
    return Array.from(map.values()).map(e=>{
      const mediaPessoal = e.nPessoal ? e.somaPessoal/e.nPessoal : null;
      const mediaGestor = e.nGestor ? e.somaGestor/e.nGestor : null;
      const mediaGeral = (mediaPessoal!==null && mediaGestor!==null) ? (mediaPessoal+mediaGestor)/2 :
                          (mediaGestor!==null ? mediaGestor : mediaPessoal);
      return { ...e, mediaPessoal, mediaGestor, mediaGeral, classificacao: this.classify(mediaGestor) };
    }).sort((a,b)=>b.feedbacks-a.feedbacks);
  },
  cards(){
    const processed = window.APP_STATE.processed;
    const rows = processed.feedback;
    const pessoal = rows.filter(r=>r.avPessoal!==null).map(r=>r.avPessoal);
    const gestor = rows.filter(r=>r.avGestor!==null).map(r=>r.avGestor);
    return {
      mediaGestor: avg(gestor),
      mediaPessoal: avg(pessoal),
      totalFeedbacks: rows.length,
      totalAdvertencias: rows.filter(r=>r.isAdvertencia).length,
      funcionariosAvaliados: uniq(rows.map(r=>r.codKey||r.nome)).length
    };
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Attendance / Chamada (fonte: QUADRO REP)                        */
/* ---------------------------------------------------------------------- */
const Attendance = {
  state: { dataInicial:null, dataFinal:null },

  getRows(){
    const processed = window.APP_STATE.processed;
    let rows = processed.quadro;
    if(this.state.dataInicial){
      const di = dateOnly(this.state.dataInicial);
      rows = rows.filter(r=>dateOnly(r.data) >= di);
    }
    if(this.state.dataFinal){
      const df = dateOnly(this.state.dataFinal);
      rows = rows.filter(r=>dateOnly(r.data) <= df);
    }
    return rows;
  },

  summary(){
    const rows = this.getRows();
    const counts = { PRESENTE:0, FALTA:0, FOLGA:0, FERIAS:0, ATESTADO:0, SEGUNDO_TURNO:0 };
    rows.forEach(r=>{ counts[r.bucket] = (counts[r.bucket]||0)+1; });
    const presencaBase = counts.PRESENTE + counts.SEGUNDO_TURNO;
    const denom = presencaBase + counts.FALTA;
    const presencaPct = denom>0 ? (presencaBase/denom*100) : null;
    const absenteismo = denom>0 ? (counts.FALTA/denom*100) : null;
    return { counts, presencaPct, absenteismo, totalRegistros: rows.length };
  },

  byDay(){
    const rows = this.getRows();
    const map = new Map();
    rows.forEach(r=>{
      const k = ymdKey(r.data);
      if(!map.has(k)) map.set(k, { date:r.data, PRESENTE:0, FALTA:0, FOLGA:0, FERIAS:0, ATESTADO:0, SEGUNDO_TURNO:0 });
      map.get(k)[r.bucket] = (map.get(k)[r.bucket]||0)+1;
    });
    const keys = Array.from(map.keys()).sort();
    return keys.map(k=>{
      const d = map.get(k);
      const base = d.PRESENTE + d.SEGUNDO_TURNO;
      const denom = base + d.FALTA;
      return { ...d, presencaPct: denom>0 ? base/denom*100 : null };
    });
  },

  faltantes(){
    const rows = this.getRows().filter(r=>r.bucket==="FALTA");
    const registry = window.APP_STATE.nameRegistry;
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.codKey)) map.set(r.codKey, { codKey:r.codKey, nome: registry.get(r.codKey)||r.nome, faltas:0, datas:[] });
      const e = map.get(r.codKey);
      e.faltas++; e.datas.push(r.data);
    });
    return Array.from(map.values()).sort((a,b)=>b.faltas-a.faltas);
  },

  individualHistory(codKey){
    const rows = window.APP_STATE.processed.quadro.filter(r=>r.codKey===codKey);
    const counts = { PRESENTE:0, FALTA:0, FOLGA:0, FERIAS:0, ATESTADO:0, SEGUNDO_TURNO:0 };
    rows.forEach(r=> counts[r.bucket] = (counts[r.bucket]||0)+1 );
    const base = counts.PRESENTE + counts.SEGUNDO_TURNO;
    const denom = base + counts.FALTA;
    return { counts, presencaPct: denom>0 ? base/denom*100 : null, registros: rows };
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Audit (fonte: AUDITORIA REP)                                    */
/* ---------------------------------------------------------------------- */
const Audit = {
  state: { dataInicial:null, dataFinal:null, rua:null, repositor:null },

  getRows(){
    const processed = window.APP_STATE.processed;
    let rows = processed.auditoria;
    if(this.state.dataInicial){
      const di = dateOnly(this.state.dataInicial);
      rows = rows.filter(r=>dateOnly(r.data) >= di);
    }
    if(this.state.dataFinal){
      const df = dateOnly(this.state.dataFinal);
      rows = rows.filter(r=>dateOnly(r.data) <= df);
    }
    if(this.state.rua){
      rows = rows.filter(r=>String(r.rua)===String(this.state.rua));
    }
    if(this.state.repositor){
      rows = rows.filter(r=>r.codKey===this.state.repositor);
    }
    return rows;
  },

  cards(){
    const rows = this.getRows();
    const valid = rows.filter(r=>r.qualidade!==null);
    const totalSim = sum(valid.map(r=>r.simCount));
    const totalNao = valid.length*7 - totalSim;
    const qualidadeMedia = valid.length ? avg(valid.map(r=>r.qualidade)) : null;

    const criterioNao = {};
    AUDIT_CRITERIA.forEach(c=>criterioNao[c]=0);
    valid.forEach(r=>{ AUDIT_CRITERIA.forEach(c=>{ if(r.criteria[c]==="NÃO") criterioNao[c]++; }); });
    let piorCriterio = null, piorVal = -1;
    Object.entries(criterioNao).forEach(([c,v])=>{ if(v>piorVal){ piorVal=v; piorCriterio=c; } });

    return {
      auditoriasRealizadas: rows.length,
      qualidadeMedia, totalSim, totalNao,
      criterioPior: piorCriterio, criterioPiorVal: piorVal,
      repositoresAuditados: uniq(rows.filter(r=>r.codKey).map(r=>r.codKey)).length,
      ruasAuditadas: uniq(rows.map(r=>r.rua)).length,
      invalidos: rows.filter(r=>r.invalid>0).length
    };
  },

  byRepositor(){
    const rows = this.getRows().filter(r=>r.codKey);
    const registry = window.APP_STATE.nameRegistry;
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.codKey)) map.set(r.codKey, { codKey:r.codKey, cod:r.cod, nome: registry.get(r.codKey)||r.nome, auditorias:0, sim:0, nao:0, qualidades:[] });
      const e = map.get(r.codKey);
      e.auditorias++;
      if(r.qualidade!==null){
        e.sim += r.simCount; e.nao += (7-r.simCount);
        e.qualidades.push(r.qualidade);
      }
    });
    return Array.from(map.values()).map(e=>({ ...e, qualidadeMedia: e.qualidades.length ? avg(e.qualidades) : null }))
      .sort((a,b)=> (b.qualidadeMedia||0)-(a.qualidadeMedia||0));
  },

  byRua(){
    const rows = this.getRows();
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.rua)) map.set(r.rua, { rua:r.rua, auditorias:0, qualidades:[] });
      const e = map.get(r.rua);
      e.auditorias++;
      if(r.qualidade!==null) e.qualidades.push(r.qualidade);
    });
    return Array.from(map.values()).map(e=>({ ...e, qualidadeMedia: e.qualidades.length ? avg(e.qualidades) : null }))
      .sort((a,b)=>Number(a.rua)-Number(b.rua));
  },

  evolucao(){
    const rows = this.getRows().filter(r=>r.qualidade!==null);
    const map = new Map();
    rows.forEach(r=>{
      const k = ymdKey(r.data);
      if(!map.has(k)) map.set(k, { date:r.data, qualidades:[] });
      map.get(k).qualidades.push(r.qualidade);
    });
    const keys = Array.from(map.keys()).sort();
    return keys.map(k=>{
      const e = map.get(k);
      return { date:e.date, qualidadeMedia: avg(e.qualidades) };
    });
  },

  simNaoPorCriterio(){
    const rows = this.getRows().filter(r=>r.invalid===0);
    return AUDIT_CRITERIA.map(c=>{
      const sim = rows.filter(r=>r.criteria[c]==="SIM").length;
      const nao = rows.filter(r=>r.criteria[c]==="NÃO").length;
      return { criterio:c, sim, nao };
    });
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: AuditOnline (fonte: Google Sheets público "Qualidade Ruas",    */
/*         exclusivo do relatório Gestão > Auditoria)                     */
/* ---------------------------------------------------------------------- */
// A aba "Auditoria" busca os dados diretamente de uma planilha Google Sheets
// pública (não depende mais da aba AUDITORIA REP do Excel carregado). Isso é
// exclusivo deste relatório — o restante do painel continua usando
// processed.auditoria normalmente.
//
// Estrutura da planilha (uma LINHA = um PRODUTO auditado): ID_Auditoria, DataHora (B),
// Matricula_Auditor, Nome_Auditor, Produto, Descricao_Produto, Endereco, Rua (H), Predio,
// Nivel, Apto, Erro_Produto (L), Endereco_Correto, Prox_Vencimento (N), Data_Vencimento,
// Sem_Saldo (P), Avaria (Q), Tipo_Avaria, Foto_Avaria, ..., Possui_NC (X),
// Matricula_Colaborador_NC (Y), Nome_Colaborador_NC (Z), ..., Links_Fotos.
//
// Os critérios (L, N, P, Q) vêm como TRUE/FALSE por linha: cada TRUE = 1 ocorrência.
// O repositor responsável (Y/Z) só vem preenchido nas linhas com NC.
// As linhas são agrupadas em "auditorias" por DIA (B) + RUA (H) + REPOSITOR (Y/Z):
//  - cada grupo com ocorrência vira uma auditoria daquele repositor, com a CONTAGEM de
//    ocorrências por critério;
//  - rua auditada no dia sem nenhuma ocorrência vira UMA auditoria impecável (sem repositor).
// Qualidade de cada auditoria segue os pesos abaixo (AUDITORIA_PESOS_CRITERIOS).
const AUDITORIA_ONLINE_SHEET_ID = "1Srs2JdL1WEGsaa-SaLec2TaYQYX_eUmNsU2zE1M4CAA";
// Peso de cada critério na qualidade "por critério" (usada quando a rua da auditoria
// não tem itens cadastrados na 8022 — nesse caso não dá pra calcular por volume, então
// cai nessa fórmula ponderada). Critério OK (valor 0) soma o peso; senão soma 0.
const AUDITORIA_PESOS_CRITERIOS = { avariado:4, pickErrado:6, proxVenc:3, semSaldo:2 };
const AUDITORIA_ONLINE_GID = "0";
// status de qualidade por faixa (usado em toda a Auditoria): Excelente/Boa/Atenção/Crítica
function auditoriaStatusQual(v){
  if(v===null||v===undefined) return { label:'—', cor:'#7a8798' };
  if(v>=95) return { label:'Excelente', cor:'#1a9c62' };
  if(v>=90) return { label:'Boa', cor:'#2f6fce' };
  if(v>=80) return { label:'Atenção', cor:'#e08a1f' };
  return { label:'Crítica', cor:'#d64545' };
}

const AuditOnline = {
  state: { dataInicial:null, dataFinal:null, atalhoSel:null, rua:null, repositor:null, auditor:null, apenasQuadroAtual:"SIM" },
  rows: null,        // null = ainda não carregado
  loading: false,
  error: null,
  lastLoadedAt: null,

  csvUrl(){
    // endpoint gviz/tq expõe CSV com CORS liberado para planilhas públicas
    // ("Qualquer pessoa com o link pode visualizar"), diferente do /export?format=csv
    return `https://docs.google.com/spreadsheets/d/${AUDITORIA_ONLINE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${AUDITORIA_ONLINE_GID}&_ts=${Date.now()}`;
  },

  async load(force){
    if(this.loading) return;
    if(this.rows && !force) return;
    this.loading = true; this.error = null;
    try{
      const res = await fetch(this.csvUrl(), { cache:"no-store" });
      if(!res.ok) throw new Error("HTTP "+res.status+" ao buscar a planilha. Verifique se o link está compartilhado como 'Qualquer pessoa com o link pode visualizar'.");
      const text = await res.text();
      this.rows = this.parseCSV(text);
      this.lastLoadedAt = new Date();
    }catch(err){
      this.error = err && err.message ? err.message : String(err);
      if(!this.rows) this.rows = [];
    }finally{
      this.loading = false;
    }
  },

  // parser CSV tolerante a campos entre aspas com vírgula/quebra de linha
  splitCSV(text){
    const rows = []; let row=[], field="", inQuotes=false;
    for(let i=0;i<text.length;i++){
      const c = text[i];
      if(inQuotes){
        if(c==='"'){ if(text[i+1]==='"'){ field+='"'; i++; } else inQuotes=false; }
        else field += c;
      } else {
        if(c==='"') inQuotes = true;
        else if(c===','){ row.push(field); field=""; }
        else if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=""; }
        else if(c==='\r'){ /* ignora */ }
        else field += c;
      }
    }
    if(field.length || row.length){ row.push(field); rows.push(row); }
    return rows.filter(r=> r.length>1 || (r.length===1 && trimStr(r[0])!==""));
  },

  parseDateFlexible(v){
    const s = trimStr(v);
    if(!s) return null;
    // formato exportado pelo Google Sheets em locale BR: DD/MM/YYYY
    let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})(?!\d)/);
    if(m) return new Date(m[3].length===2 ? 2000+(+m[3]) : +m[3], +m[2]-1, +m[1]);
    // fallback ISO: YYYY-MM-DD
    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if(m) return new Date(+m[1], +m[2]-1, +m[3]);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  },

  // "10003805 - Luis Paulo" → { cod:"10003805", nome:"Luis Paulo" }
  parseRepositor(v){
    const s = trimStr(v);
    if(!s) return { cod:null, nome:"" };
    const m = s.match(/^(\d+)\s*-\s*(.+)$/);
    if(m) return { cod: m[1], nome: trimStr(m[2]) };
    return { cod:null, nome: s };
  },

  parseCSV(text){
    const lines = this.splitCSV(text);
    if(!lines.length) return [];
    const headers = lines[0].map(h=>trimStr(h));
    const findCol = (names) => {
      for(const n of names){
        const i = headers.findIndex(h=>normStr(h)===normStr(n));
        if(i!==-1) return i;
      }
      return -1;
    };
    const iData = findCol(["DataHora","Data Hora","Data"]);                       // B
    const iAuditor = findCol(["Nome_Auditor","Auditor","usuario"]);                // D
    const iRua = findCol(["Rua"]);                                                 // H
    const iProduto = findCol(["Produto"]);                                         // E
    const iDescProd = findCol(["Descricao_Produto"]);                              // F
    const iEndereco = findCol(["Endereco"]);                                       // G
    const iPickErrado = findCol(["Erro_Produto"]);                                 // L
    const iProxVenc = findCol(["Prox_Vencimento"]);                                // N
    const iSemSaldo = findCol(["Sem_Saldo"]);                                      // P
    const iAvariado = findCol(["Avaria"]);                                         // Q
    const iFotoAvaria = findCol(["Foto_Avaria"]);                                  // S
    const iPossuiNC = findCol(["Possui_NC"]);                                      // X
    const iMatricula = findCol(["Matricula_Colaborador_NC"]);                      // Y
    const iNomeColab = findCol(["Nome_Colaborador_NC"]);                           // Z
    const iLinksFotos = findCol(["Links_Fotos"]);

    const faltando = [["DataHora",iData],["Rua",iRua],["Erro_Produto",iPickErrado],["Prox_Vencimento",iProxVenc],
      ["Sem_Saldo",iSemSaldo],["Avaria",iAvariado],["Matricula_Colaborador_NC",iMatricula],["Nome_Colaborador_NC",iNomeColab]]
      .filter(x=>x[1]===-1).map(x=>x[0]);
    if(faltando.length) throw new Error("A planilha de Auditoria não tem as colunas esperadas: "+faltando.join(", ")+".");

    const isTrue = (v) => /^(true|verdadeiro|sim|s|1|x)$/i.test(trimStr(v));
    const cell = (cols, i) => i!==-1 ? trimStr(cols[i]) : "";

    // 1) agrupa as linhas (produtos) por dia + rua + repositor
    const grupos = new Map();
    for(let li=1; li<lines.length; li++){
      const cols = lines[li];
      if(!cols || cols.every(c=>trimStr(c)==="")) continue;
      const data = this.parseDateFlexible(cols[iData]);
      if(!data) continue;
      const rua = cell(cols,iRua);
      if(!rua) continue;
      const cod = cell(cols,iMatricula) || null;
      const nome = cell(cols,iNomeColab);
      const gkey = ymdKey(data)+"|"+rua+"|"+(cod?normStr(cod):(nome?"N:"+normStr(nome):""));
      if(!grupos.has(gkey)) grupos.set(gkey, { data, rua, cod, nome, auditores:new Set(), pickErrado:0, avariado:0, proxVenc:0, semSaldo:0, produtos:0, itens:[], fotos:[] });
      const g = grupos.get(gkey);
      g.produtos++;
      const aud = cell(cols,iAuditor); if(aud) g.auditores.add(aud);
      const pe = isTrue(cols[iPickErrado]), av = isTrue(cols[iAvariado]), pv = isTrue(cols[iProxVenc]), ss = isTrue(cols[iSemSaldo]);
      if(pe) g.pickErrado++; if(av) g.avariado++; if(pv) g.proxVenc++; if(ss) g.semSaldo++;
      if(pe||av||pv||ss){
        const tipos = [pe?"Picking errado":"", av?"Avaria":"", pv?"Próx. vencimento":"", ss?"Sem saldo":""].filter(Boolean).join(", ");
        g.itens.push({ produto:cell(cols,iProduto), desc:cell(cols,iDescProd), endereco:cell(cols,iEndereco), tipos });
      }
      [cell(cols,iFotoAvaria), cell(cols,iLinksFotos)].forEach(f=>{ if(f && !g.fotos.includes(f)) g.fotos.push(f); });
    }

    // 2) rua auditada no dia: se já há auditoria(s) com repositor/ocorrência, o grupo "sem
    //    repositor e sem ocorrência" é descartado (a rua já está representada); se não há
    //    nenhuma, ele permanece como UMA auditoria impecável da rua.
    const lista = Array.from(grupos.values());
    const temOutro = new Set(lista.filter(g=>g.cod||g.nome||g.pickErrado+g.avariado+g.proxVenc+g.semSaldo>0).map(g=>ymdKey(g.data)+"|"+g.rua));
    const finais = lista.filter(g=>{
      const vazio = !g.cod && !g.nome && g.pickErrado+g.avariado+g.proxVenc+g.semSaldo===0;
      return !(vazio && temOutro.has(ymdKey(g.data)+"|"+g.rua));
    }).sort((x,y)=> x.data-y.data || String(x.rua).localeCompare(String(y.rua),undefined,{numeric:true}));

    // 3) converte cada grupo em uma "auditoria" com as contagens de ocorrência
    const pesos = AUDITORIA_PESOS_CRITERIOS;
    const pesoTotal = pesos.avariado + pesos.pickErrado + pesos.proxVenc + pesos.semSaldo;
    return finais.map((g,idx)=>{
      const { pickErrado, avariado, proxVenc, semSaldo } = g;
      const totalOcorrencias = pickErrado + avariado + proxVenc + semSaldo;
      const pesoOk = (avariado===0?pesos.avariado:0) + (pickErrado===0?pesos.pickErrado:0) + (proxVenc===0?pesos.proxVenc:0) + (semSaldo===0?pesos.semSaldo:0);
      const criteriosOk = (pickErrado===0?1:0)+(avariado===0?1:0)+(proxVenc===0?1:0)+(semSaldo===0?1:0);
      return {
        _row: idx, data: g.data, rua: g.rua, cod: g.cod, nome: g.nome,
        auditor: Array.from(g.auditores).join(" / "),
        codKey: g.cod ? normStr(g.cod) : (g.nome?"NOME::"+normStr(g.nome):null),
        pickErrado, avariado, proxVenc, semSaldo, totalOcorrencias,
        criteriosOk, qualidade: pesoOk/pesoTotal*100,
        impecavel: totalOcorrencias===0,
        temProblema: totalOcorrencias>0,
        produtosAuditados: g.produtos, itens: g.itens,
        possuiImagem: g.fotos.length>0, foto: g.fotos[0]||"", foto2: g.fotos[1]||""
      };
    });
  },

  getRows(){
    let rows = this.rows || [];
    const st = this.state;
    if(st.dataInicial){ const di=dateOnly(st.dataInicial); rows = rows.filter(r=>dateOnly(r.data)>=di); }
    if(st.dataFinal){ const df=dateOnly(st.dataFinal); rows = rows.filter(r=>dateOnly(r.data)<=df); }
    if(st.rua) rows = rows.filter(r=>String(r.rua)===String(st.rua));
    if(st.repositor) rows = rows.filter(r=>r.codKey===st.repositor);
    if(st.auditor) rows = rows.filter(r=>r.auditor===st.auditor);
    if(st.apenasQuadroAtual==="SIM"){
      const codes = window.APP_STATE.currentTeam ? window.APP_STATE.currentTeam.codes : null;
      if(codes) rows = rows.filter(r=>r.codKey && codes.has(r.codKey));
    }
    return rows;
  },

  // "penalidade" de uma linha, em item-equivalentes: cada ocorrência de um critério
  // "consome" o peso daquele critério em itens da rua. Ex.: 1 avaria (peso 4) tira
  // 4 dos itens da rua; 3 avarias tiram 12.
  penalidadeLinha(row){
    const p = AUDITORIA_PESOS_CRITERIOS;
    return row.pickErrado*p.pickErrado + row.avariado*p.avariado + row.proxVenc*p.proxVenc + row.semSaldo*p.semSaldo;
  },

  // qualidade de UMA linha = (itens cadastrados na 8022 da rua - penalidade ponderada
  // daquela auditoria) / itens da rua. Ex.: rua com 100 itens e 1 avaria (peso 4) →
  // (100-4)/100 = 96%. Quando a rua não tem itens conhecidos na 8022, cai para a nota
  // por critério em percentual (peso OK / peso total × 100).
  qualidadeLinha(row){
    const itens = this.ruaItensMap().get(String(row.rua)) || 0;
    if(itens>0){
      const pen = this.penalidadeLinha(row);
      return Math.max(0, Math.min(100, (itens-pen)/itens*100));
    }
    return row.qualidade;
  },

  // qualidade média de um conjunto de linhas — média da qualidade (por volume ponderado,
  // com fallback por critério) de cada uma
  qualidadeDe(rows){
    return rows.length ? avg(rows.map(r=>this.qualidadeLinha(r))) : null;
  },

  // qualidade média num intervalo [ini,fim], respeitando os filtros de repositor/rua/
  // auditor/quadro atual ativos, mas ignorando o filtro de datas do Ciclo (usado pelos
  // 3 cards fixos por calendário)
  qualidadeNoIntervalo(ini, fim){
    const st = this.state;
    let rows = (this.rows||[]).filter(r=>{ const d=dateOnly(r.data); return d>=ini && d<=fim; });
    if(st.rua) rows = rows.filter(r=>String(r.rua)===String(st.rua));
    if(st.repositor) rows = rows.filter(r=>r.codKey===st.repositor);
    if(st.auditor) rows = rows.filter(r=>r.auditor===st.auditor);
    if(st.apenasQuadroAtual==="SIM"){
      const codes = window.APP_STATE.currentTeam ? window.APP_STATE.currentTeam.codes : null;
      if(codes) rows = rows.filter(r=>r.codKey && codes.has(r.codKey));
    }
    return this.qualidadeDe(rows);
  },

  // qualidade por repositor num intervalo [ini,fim] — ignora TODOS os filtros da tela
  // de Auditoria (usado por outras telas, como o Ranking de Repositores do Feedback,
  // que precisam de um número "cru" e estável independente do que está selecionado
  // em Gestão > Auditoria no momento)
  qualidadePorRepositorNoIntervalo(ini, fim){
    const rows = (this.rows||[]).filter(r=>{ const d=dateOnly(r.data); return d>=ini && d<=fim && r.codKey; });
    const map = new Map();
    rows.forEach(r=>{ if(!map.has(r.codKey)) map.set(r.codKey, []); map.get(r.codKey).push(r); });
    const out = new Map();
    map.forEach((rs,codKey)=>{ out.set(codKey, { auditorias: rs.length, qualidadeMedia: this.qualidadeDe(rs) }); });
    return out;
  },

  cards(){
    const rows = this.getRows();
    const qualidadeMedia = this.qualidadeDe(rows);
    const totalOcorrencias = sum(rows.map(r=>r.totalOcorrencias));
    const auditoriasComProblema = rows.filter(r=>r.temProblema).length;
    const totalPickErrado = sum(rows.map(r=>r.pickErrado));
    const totalAvariado = sum(rows.map(r=>r.avariado));
    const totalProxVenc = sum(rows.map(r=>r.proxVenc));
    const totalSemSaldo = sum(rows.map(r=>r.semSaldo));

    const byRua = this.byRua();
    const ruasCriticas = byRua.filter(e=>e.qualidadeMedia!==null && e.qualidadeMedia<80).length;

    // --- 3 cards fixos por calendário (independem do filtro de Ciclo) ---
    const hoje = new Date();
    const anoAtual = hoje.getFullYear(), mesAtual = hoje.getMonth();
    const iniMesAtual = new Date(anoAtual, mesAtual, 1);
    const fimMesAtual = new Date(anoAtual, mesAtual+1, 0);
    const qualMesAtual = this.qualidadeNoIntervalo(iniMesAtual, fimMesAtual);

    const iniMesAnt = new Date(anoAtual, mesAtual-1, 1);
    const fimMesAnt = new Date(anoAtual, mesAtual, 0);
    const qualMesAnterior = this.qualidadeNoIntervalo(iniMesAnt, fimMesAnt);

    // Últimos 3 meses = os 3 meses fechados anteriores ao atual (ex.: em Set → Jun/Jul/Ago)
    const iniUlt3 = new Date(anoAtual, mesAtual-3, 1);
    const fimUlt3 = new Date(anoAtual, mesAtual, 0);
    const qualUlt3Meses = this.qualidadeNoIntervalo(iniUlt3, fimUlt3);

    return {
      auditoriasRealizadas: rows.length, qualidadeMedia, totalOcorrencias, auditoriasComProblema,
      totalPickErrado, totalAvariado, totalProxVenc, totalSemSaldo,
      repositoresAuditados: uniq(rows.filter(r=>r.codKey).map(r=>r.codKey)).length,
      auditoresAtivos: uniq(rows.filter(r=>r.auditor).map(r=>r.auditor)).length,
      ruasAuditadas: uniq(rows.map(r=>r.rua)).length,
      ruasCriticas,
      qualMesAtual, qualMesAnterior, qualUlt3Meses
    };
  },

  byRepositor(){
    const rows = this.getRows().filter(r=>r.codKey);
    const registry = window.APP_STATE.nameRegistry;
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.codKey)) map.set(r.codKey, { codKey:r.codKey, cod:r.cod, nome: registry.get(r.codKey)||r.nome, auditorias:0, pickErrado:0, avariado:0, proxVenc:0, semSaldo:0, ocorrencias:0 });
      const e = map.get(r.codKey);
      e.auditorias++; e.ocorrencias += r.totalOcorrencias;
      e.pickErrado += r.pickErrado; e.avariado += r.avariado; e.proxVenc += r.proxVenc; e.semSaldo += r.semSaldo;
    });
    return Array.from(map.values()).map(e=>({...e, qualidadeMedia: this.qualidadeDe(rows.filter(r=>r.codKey===e.codKey))}))
      .sort((a,b)=>(b.qualidadeMedia||0)-(a.qualidadeMedia||0));
  },

  byAuditor(){
    const rows = this.getRows().filter(r=>r.auditor);
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.auditor)) map.set(r.auditor, { auditor:r.auditor, ruas:new Set(), auditorias:0, ocorrencias:0 });
      const e = map.get(r.auditor);
      e.auditorias++; e.ruas.add(r.rua); e.ocorrencias += r.totalOcorrencias;
    });
    return Array.from(map.values()).map(e=>({ auditor:e.auditor, ruas:e.ruas.size, auditorias:e.auditorias, ocorrencias:e.ocorrencias,
        qualidadeMedia: this.qualidadeDe(rows.filter(r=>r.auditor===e.auditor)) }))
      .sort((a,b)=>b.ruas-a.ruas);
  },

  // Detalhamento por Repositor × Rua (granularidade pedida no relatório)
  byRepositorRua(){
    const rows = this.getRows().filter(r=>r.codKey);
    const registry = window.APP_STATE.nameRegistry;
    const map = new Map();
    rows.forEach(r=>{
      const k = r.codKey+'|||'+r.rua;
      if(!map.has(k)) map.set(k, { codKey:r.codKey, cod:r.cod, nome: registry.get(r.codKey)||r.nome, rua:r.rua, auditorias:0, pickErrado:0, avariado:0, proxVenc:0, semSaldo:0, ocorrencias:0 });
      const e = map.get(k);
      e.auditorias++; e.ocorrencias += r.totalOcorrencias;
      e.pickErrado += r.pickErrado; e.avariado += r.avariado; e.proxVenc += r.proxVenc; e.semSaldo += r.semSaldo;
    });
    return Array.from(map.values()).map(e=>{
      const rowsDoGrupo = rows.filter(r=>r.codKey===e.codKey&&r.rua===e.rua);
      const { qualidade, itens } = this.qualidadeRuaPorCatalogo(e.rua, e.ocorrencias, rowsDoGrupo);
      return {...e, itens8022: itens, qualidadeMedia: qualidade};
    }).sort((a,b)=>(a.qualidadeMedia||0)-(b.qualidadeMedia||0));
  },

  // itens cadastrados por rua na sheet 8022 — usado para calcular qualidade da rua
  // relativa ao tamanho do catálogo dela (rua com mais itens "dilui" mais erros)
  ruaItensMap(){
    const processed = window.APP_STATE.processed;
    const map = new Map();
    if(!processed || !processed.p8022dispo || !processed.prod2info8022) return map;
    processed.prod2info8022.forEach(info=>{
      if(!info.rua) return;
      const k = String(info.rua);
      map.set(k, (map.get(k)||0)+1);
    });
    return map;
  },

  // Qualidade agregada de uma rua = (itens cadastrados na 8022 - soma da penalidade
  // ponderada de todas as auditorias daquela rua) / itens. Sem itens conhecidos,
  // cai para a média da nota por critério.
  qualidadeRuaPorCatalogo(rua, ocorrencias, rowsDaRua){
    const itens = this.ruaItensMap().get(String(rua)) || 0;
    if(itens>0){
      const penTotal = sum(rowsDaRua.map(r=>this.penalidadeLinha(r)));
      return { qualidade: Math.max(0, Math.min(100, (itens-penTotal)/itens*100)), itens };
    }
    return { qualidade: this.qualidadeDe(rowsDaRua), itens: 0 };
  },

  byRua(){
    const rows = this.getRows();
    const map = new Map();
    rows.forEach(r=>{
      if(!map.has(r.rua)) map.set(r.rua, { rua:r.rua, auditorias:0, pickErrado:0, avariado:0, proxVenc:0, semSaldo:0, ocorrencias:0 });
      const e = map.get(r.rua);
      e.auditorias++; e.ocorrencias += r.totalOcorrencias;
      e.pickErrado += r.pickErrado; e.avariado += r.avariado; e.proxVenc += r.proxVenc; e.semSaldo += r.semSaldo;
    });
    return Array.from(map.values()).map(e=>{
      const rowsDaRua = rows.filter(r=>r.rua===e.rua);
      const { qualidade, itens } = this.qualidadeRuaPorCatalogo(e.rua, e.ocorrencias, rowsDaRua);
      return {...e, itens8022: itens, qualidadeMedia: qualidade};
    }).sort((a,b)=>String(a.rua).localeCompare(String(b.rua), undefined, {numeric:true}));
  },

  evolucao(){
    const rows = this.getRows();
    const map = new Map();
    rows.forEach(r=>{ const k=ymdKey(r.data); if(!map.has(k)) map.set(k,{date:r.data,rows:[]}); map.get(k).rows.push(r); });
    return Array.from(map.keys()).sort().map(k=>{ const e=map.get(k); return { date:e.date, qualidadeMedia:this.qualidadeDe(e.rows) }; });
  },

  ocorrenciasPorTipo(){
    const rows = this.getRows();
    return [
      { tipo:"Picking Errado", total: sum(rows.map(r=>r.pickErrado)) },
      { tipo:"Avariados", total: sum(rows.map(r=>r.avariado)) },
      { tipo:"Próx. Vencimento", total: sum(rows.map(r=>r.proxVenc)) },
      { tipo:"Sem Saldo", total: sum(rows.map(r=>r.semSaldo)) }
    ];
  }
};


const Missions = {
  totalValue(cfg){
    return sum((cfg.missions||[]).map(m=> (m.qty||0) * (m.osEquiv||0) * (m.valuePerOs||0) ));
  },
  totalOsEquiv(cfg){
    return sum((cfg.missions||[]).map(m=> (m.qty||0) * (m.osEquiv||0) ));
  },

  /* --------------------------------------------------------------------
     CÁLCULO DE O.S. EQUIVALENTE POR MISSÃO (baseado na sheet MISSÕES real).

       O.S. da Missão = Média Histórica de O.S./dia do Colaborador × (Tempo Total ÷ 9h)

     - Média histórica: total de O.S. 58 do colaborador em TODA a 8460 ÷ dias
       distintos em que ele produziu algo (não é só o mês atual).
     - Arredondamento: sempre para baixo (floor) — nunca arredonda pra cima.

     Este valor é somado à produção do colaborador para fins de comissão
     (representa o quanto ele teria produzido se não estivesse na missão),
     substituindo a antiga regra fixa de "1 missão = 6 O.S. = R$3,00".
  -------------------------------------------------------------------- */
  osParaMissao(codKey, tempoTotalHoras){
    const mediaDiaria = Production.employeeHistoricalDailyAverage(codKey);
    const fracao = tempoTotalHoras / 9;
    const bruto = mediaDiaria * fracao;
    return Math.floor(bruto);
  },

  // Retorna, para um funcionário e um intervalo de datas opcional, o total de
  // O.S. equivalentes gerados pelas missões reais da sheet MISSÕES.
  realMissionsOsForEmployee(codKey, dataInicial, dataFinal){
    const processed = window.APP_STATE.processed;
    if(!processed || !processed.missoesDispo) return { totalOs:0, registros:[] };
    let rows = processed.missoes.filter(r=>r.codKey===codKey);
    if(dataInicial) rows = rows.filter(r=> !r.data || dateOnly(r.data) >= dateOnly(dataInicial));
    if(dataFinal) rows = rows.filter(r=> !r.data || dateOnly(r.data) <= dateOnly(dataFinal));
    const registros = rows.map(r=>({
      ...r,
      osCalculado: this.osParaMissao(r.codKey, r.tempoTotalHoras)
    }));
    return { totalOs: sum(registros.map(r=>r.osCalculado)), registros };
  },

  // Mesma coisa, mas para todos os funcionários de uma vez (mapa codKey -> resultado)
  realMissionsOsAll(dataInicial, dataFinal){
    const processed = window.APP_STATE.processed;
    const map = new Map();
    if(!processed || !processed.missoesDispo) return map;
    let rows = processed.missoes;
    if(dataInicial) rows = rows.filter(r=> !r.data || dateOnly(r.data) >= dateOnly(dataInicial));
    if(dataFinal) rows = rows.filter(r=> !r.data || dateOnly(r.data) <= dateOnly(dataFinal));
    rows.forEach(r=>{
      if(!map.has(r.codKey)) map.set(r.codKey, { totalOs:0, registros:[] });
      const osCalculado = this.osParaMissao(r.codKey, r.tempoTotalHoras);
      const entry = map.get(r.codKey);
      entry.totalOs += osCalculado;
      entry.registros.push({ ...r, osCalculado });
    });
    return map;
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Commission (fonte: produção 8460 + config editável)             */
/* ---------------------------------------------------------------------- */
const Commission = {
  findBand(points, bands){
    const active = (bands||[]).filter(b=>b.active!==false);
    return active.find(b=> points>=b.min && points<=b.max) || null;
  },
  findException(codKey, cod, exceptions){
    return (exceptions||[]).find(e=> e.active!==false && e.codigo && normStr(e.codigo)===normStr(cod||"") );
  },
  // Fator de ajuste por qualidade, aplicado SEMPRE em cima da comissão normal (por
  // faixa/exceção) — não é um modelo alternativo, é um multiplicador sobre o valor já
  // calculado: <50%=0 (zera) · 50-69,99%=0.5 (metade) · >=70%=qualidade/100 (proporcional,
  // ex.: 71% de qualidade mantém 71% do valor da comissão).
  qualityFactor(qualidade){
    if(qualidade===null || qualidade===undefined) return null; // sem dado de auditoria — não penaliza, mantém valor cheio
    if(qualidade < 50) return 0;
    if(qualidade < 70) return 0.5;
    return qualidade/100;
  },
  computeAll(dataInicial, dataFinal, considerarMissoes){
    considerarMissoes = considerarMissoes !== false; // default true
    const cfg = window.APP_STATE.commissionConfig;
    const registry = window.APP_STATE.nameRegistry;
    let prodRows = window.APP_STATE.processed.p8460.filter(r=>r.tipoos===58);
    if(dataInicial){ const di = dateOnly(dataInicial); prodRows = prodRows.filter(r=>dateOnly(r.dtinicio) >= di); }
    if(dataFinal){ const df = dateOnly(dataFinal); prodRows = prodRows.filter(r=>dateOnly(r.dtinicio) <= df); }

    const map = new Map();
    prodRows.forEach(r=>{
      if(!map.has(r.codKey)) map.set(r.codKey, { codKey:r.codKey, cod:r.cod, nome: registry.get(r.codKey)||r.nome, producao:0 });
      map.get(r.codKey).producao++;
    });

    // Missões reais (sheet MISSÕES): O.S. equivalente por colaborador, no mesmo período filtrado.
    // Substitui a antiga regra fixa (1 missão = 6 O.S. = R$3,00) — agora é calculado
    // individualmente: Média Histórica do colaborador × (Tempo Total da Missão ÷ 9h), arredondado p/ baixo.
    const missoesPorFuncionario = Missions.realMissionsOsAll(dataInicial, dataFinal);
    missoesPorFuncionario.forEach((info, codKey)=>{
      if(!map.has(codKey)){
        // funcionário só tem missão no período, sem produção direta — ainda entra na tabela
        map.set(codKey, { codKey, cod:null, nome: registry.get(codKey)||codKey, producao:0 });
      }
    });

    // % Qualidade — vem da Auditoria online (Gestão > Auditoria, mesma planilha Google
    // Sheets), calculada no MESMO período filtrado nesta tela (mês/intervalo selecionado
    // em Gestão > Comissão). Sem filtro de data ativo, usa o mês atual até o momento
    // (maxDataDate), que é o período padrão exibido.
    const maxDateProd = Production.maxDataDate();
    let qIni, qFim;
    if(dataInicial || dataFinal){
      qIni = dataInicial ? dateOnly(dataInicial) : dateOnly(new Date(dataFinal.getFullYear(), dataFinal.getMonth(), 1));
      qFim = dataFinal ? dateOnly(dataFinal) : dateOnly(maxDateProd||new Date());
    } else if(maxDateProd){
      qIni = dateOnly(new Date(maxDateProd.getFullYear(), maxDateProd.getMonth(), 1));
      qFim = dateOnly(maxDateProd);
    }
    const qualidadePorRep = (qIni && qFim) ? AuditOnline.qualidadePorRepositorNoIntervalo(qIni, qFim) : new Map();

    return Array.from(map.values()).map(e=>{
      const missaoInfo = missoesPorFuncionario.get(e.codKey);
      const missoesOs = missaoInfo ? missaoInfo.totalOs : 0;
      const pontos = considerarMissoes ? (e.producao + missoesOs) : e.producao;
      const qInfo = qualidadePorRep.get(e.codKey);
      const qualidade = qInfo && qInfo.qualidadeMedia!==null ? qInfo.qualidadeMedia : null;

      const exc = this.findException(e.codKey, e.cod, cfg.exceptions);
      let valorPonto, regra, band;
      if(exc){
        valorPonto = exc.valuePerPoint; regra = "Exceção Individual";
      } else {
        band = this.findBand(pontos, cfg.bands);
        valorPonto = band ? band.value : 0;
        regra = band ? "Regra Normal" : "Sem faixa aplicável";
      }
      const comissaoBase = pontos * valorPonto;

      const fator = this.qualityFactor(qualidade);
      const comissaoComDesconto = fator===null ? comissaoBase : comissaoBase*fator;
      if(fator===null) regra += " — sem auditoria no período (comissão integral)";
      else if(fator===0) regra += ` — qualidade ${fmtNum(qualidade,1)}% (<50%): comissão zerada`;
      else if(fator===0.5) regra += ` — qualidade ${fmtNum(qualidade,1)}% (50-69%): metade da comissão`;
      else regra += ` — qualidade ${fmtNum(qualidade,1)}%: ${fmtNum(fator*100,1)}% da comissão`;

      // comissaoTotal = o valor "oficial" exibido/exportado, conforme o toggle
      // "Aplicar desconto por qualidade?" — comissaoBase e comissaoComDesconto ficam
      // sempre disponíveis nos dois totais do resumo, independente do toggle.
      const comissaoTotal = commissionAplicarDesconto==="SIM" ? comissaoComDesconto : comissaoBase;

      return {
        ...e, missoesOs, pontos, valorPonto, regra, band, qualidade,
        comissaoBase, comissaoComDesconto, comissaoTotal
      };
    }).sort((a,b)=>b.comissaoTotal-a.comissaoTotal);
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Charts (Chart.js wrappers)                                      */
/* ---------------------------------------------------------------------- */
const Charts = {
  instances: {},
  colors: {
    blue:"#2f6fce", blueDark:"#123a6b", green:"#1a9c62", red:"#d64545",
    orange:"#e08a1f", gray:"#7a8798", blueLight:"#cfe3fb"
  },
  destroy(id){
    if(this.instances[id]){ this.instances[id].destroy(); delete this.instances[id]; }
  },
  // destrói gráficos cujo <canvas> saiu do DOM (painel redesenhado): evita listeners/tooltip órfãos
  purgeOrfaos(){
    Object.keys(this.instances).forEach(k=>{
      const ch = this.instances[k];
      if(!ch || !ch.canvas || !document.body.contains(ch.canvas)){ try{ ch && ch.destroy(); }catch(e){} delete this.instances[k]; }
    });
  },
  // painéis ocultos (display:none) medem 0x0; ao exibir, força o recálculo do tamanho
  resizeAll(){
    requestAnimationFrame(()=>{
      this.purgeOrfaos();
      Object.values(this.instances).forEach(ch=>{ try{ ch.resize(); ch.update("none"); }catch(e){} });
    });
  },
  make(id, config){
    this.purgeOrfaos();
    this.destroy(id);
    const el = document.getElementById(id);
    if(!el) return;
    this.instances[id] = new Chart(el.getContext("2d"), config);
    return this.instances[id];
  },
  // configuração padrão dos rótulos de dados — sempre visíveis (não depende de hover),
  // essencial para leitura em PDF/impressão. 'auto' evita poluição visual escondendo
  // rótulos que se sobreporiam.
  defaultDatalabels(){
    return {
      display: "auto",
      color: Design.cores().rotulo,
      font: { size: 10, weight: "700" },
      anchor: "end",
      align: "top",
      offset: 3,
      clip: false,
      formatter: (value)=>{
        if(value===null || value===undefined || value==="") return "";
        if(typeof value === "number"){
          if(!isFinite(value)) return "";
          return Number.isInteger(value) ? fmtNum(value) : fmtNum(value,1);
        }
        return value;
      }
    };
  },

  baseOptions(extra){
    extra = extra || {};
    const cor = Design.cores();
    const defaults = {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ labels:{ font:{ size:11 }, color:cor.texto } },
        tooltip:{ backgroundColor:cor.tooltip, padding:10, titleFont:{size:12}, bodyFont:{size:12} },
        datalabels: this.defaultDatalabels()
      },
      scales:{
        x:{ grid:{ display:false }, ticks:{ color:cor.suave, font:{size:11} } },
        y:{ grid:{ color:cor.grade }, ticks:{ color:cor.suave, font:{size:11} }, beginAtZero:true }
      }
    };
    const merged = Object.assign({}, defaults, extra);
    // merge por chave dentro de "plugins": datalabels sempre sobrevive, a menos que
    // o próprio gráfico peça explicitamente para desativar (plugins.datalabels:false)
    merged.plugins = Object.assign({}, defaults.plugins, extra.plugins);
    if(extra.plugins && extra.plugins.datalabels !== undefined){
      merged.plugins.datalabels = extra.plugins.datalabels === false
        ? { display:false }
        : Object.assign({}, defaults.plugins.datalabels, extra.plugins.datalabels);
    } else {
      merged.plugins.datalabels = defaults.plugins.datalabels;
    }
    if(extra.scales) merged.scales = Object.assign({}, defaults.scales, extra.scales);
    return merged;
  }
};

/* ---------------------------------------------------------------------- */
/* MODULE: Export                                                          */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* MODULE: FeedbackDoc — geração do Termo de Feedback (.docx) no navegador */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* Histórico de produção e indicadores individuais (usados no PDF de Feedback) */
/* ---------------------------------------------------------------------- */

// O.S. dia anterior / última semana / mês anterior (completo) / últimos 3 meses do funcionário
function computeEmployeeProductionHistory(codKey){
  const processed = window.APP_STATE.processed;
  const rows = processed.p8460.filter(r=>r.tipoos===58 && r.codKey===codKey);
  const maxDate = Production.maxDataDate();
  if(!maxDate) return { osDiaAnterior:0, osSemana:0, osMesAnterior:0, mesAnteriorLabel:null, os3Meses:0, ontem:null, maxDate:null };

  const ontem = addDays(dateOnly(maxDate), -1);
  const inicioSemana = startOfWeekMonday(maxDate);
  // mês anterior COMPLETO (não confundir com "mês atual até hoje", que é o mesmo período do card "O.S. Atual")
  const inicioMesAnterior = dateOnly(addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), -1));
  const fimMesAnterior = dateOnly(new Date(maxDate.getFullYear(), maxDate.getMonth(), 0)); // último dia do mês anterior
  const mesAnteriorLabel = fmtMonthYear(inicioMesAnterior.getFullYear(), inicioMesAnterior.getMonth());
  const inicio3Meses = addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), -2);
  const hojeD = dateOnly(maxDate);

  const osDiaAnterior = rows.filter(r=>dateOnly(r.dtinicio).getTime()===ontem.getTime()).length;
  const osSemana = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=inicioSemana && d<=hojeD; }).length;
  const osMesAnterior = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=inicioMesAnterior && d<=fimMesAnterior; }).length;
  const os3Meses = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=inicio3Meses && d<=hojeD; }).length;

  return { osDiaAnterior, osSemana, osMesAnterior, mesAnteriorLabel, os3Meses, ontem, maxDate };
}

// Reaproveita EXATAMENTE a lógica de Indicadores > Produção (executiveSummary, modeComparison,
// projection), só que temporariamente restrita a um único funcionário — garante que os números
// do PDF batem 100% com o que apareceria na tela se esse funcionário fosse filtrado lá.
function computeEmployeeProductionSnapshot(codKey){
  const savedState = JSON.parse(JSON.stringify(Production.state));
  try{
    Production.state.employees = [codKey];
    Production.state.quadroAtual = "NAO"; // já restrito a 1 pessoa; não precisa também exigir quadro atual
    Production.state.mode = "mes";
    Production.state.mesmaPeriodicidade = "SIM";
    Production.state.dataInicial = null;
    Production.state.dataFinal = null;
    if(Production.state.projectionBase === undefined || Production.state.projectionBase === null) Production.state.projectionBase = 0;

    const exec = Production.executiveSummary();
    const cmp = Production.modeComparison();
    const proj = Production.projection();
    return { exec, cmp, proj };
  } finally {
    Production.state = savedState;
  }
}

const FeedbackDoc = {
  cargoLabel: { LIDER:"Líder", AUXILIAR:"Auxiliar", REPOSITOR:"Repositor" },

  // Constrói o HTML compacto do documento (1 página) dentro de um container off-screen,
  // já com os 2 gráficos e os cards de indicadores calculados para o funcionário.
  buildContainer(employee, hist, snap, idx, indData){
    idx = idx===undefined ? "" : idx;
    const logoSrc = "data:image/png;base64," + LOGO_BASE64;
    const hoje = fmtDateBR(new Date());
    const exec = snap.exec, cmp = snap.cmp, proj = snap.proj;

    const cardHtml = (label, value, sub, color) => `
      <div style="flex:1;border:1px solid #dde3ea;border-radius:6px;padding:8px 10px;background:#fff;border-left:3px solid ${color||'#2f6fce'};">
        <div style="font-size:9px;font-weight:700;color:#7a8798;text-transform:uppercase;letter-spacing:.3px;">${label}</div>
        <div style="font-size:17px;font-weight:800;color:${color||'#123a6b'};line-height:1.15;">${value}</div>
        ${sub?`<div style="font-size:8.5px;color:#7a8798;margin-top:1px;">${sub}</div>`:''}
      </div>`;

    const labelCellHtml = (text, widthPct) => `<td style="width:${widthPct||25}%;background:#eaeef3;border:1px solid #c3ccd6;padding:4px 7px;font-size:10px;font-weight:700;color:#123a6b;">${text}</td>`;
    const valueCellHtml = (text, widthPct) => `<td style="width:${widthPct||25}%;border:1px solid #c3ccd6;padding:4px 7px;font-size:10.5px;font-weight:700;">${text}</td>`;
    const blankCellHtml = (widthPct, height) => `<td style="width:${widthPct}%;border:1px solid #c3ccd6;height:${height||22}px;"></td>`;
    const checkItem = (label) => `<td style="width:${(100/7).toFixed(2)}%;border:1px solid #c3ccd6;padding:4px 4px;font-size:8px;text-align:center;vertical-align:middle;line-height:1.25;">${label}<br><strong>( )</strong></td>`;

    const scaleRowHtml = (color) => {
      let cells = "";
      for(let i=0;i<=10;i++){
        cells += `<td style="border:1px solid ${color};text-align:center;padding:4px 0;font-size:11px;font-weight:800;width:${(100/11).toFixed(2)}%;">${i}</td>`;
      }
      return `<table style="width:100%;border-collapse:collapse;table-layout:fixed;"><tr>${cells}</tr></table>`;
    };

    const el = document.createElement("div");
    el.id = "feedback-pdf-container-" + idx;
    el.className = "feedback-pdf-container keep-light";
    el.style.cssText = "position:fixed; left:-99999px; top:0; width:1500px; background:#ffffff; font-family:-apple-system,Segoe UI,Arial,sans-serif; color:#1f2937; padding:20px 26px;";

    el.innerHTML = `
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>
          <td style="width:110px;border:1px solid #c3ccd6;text-align:center;padding:6px;"><img src="${logoSrc}" style="height:46px;width:auto;"></td>
          <td style="background:#eaeef3;border:1px solid #c3ccd6;padding:10px 16px;"><span style="font-size:19px;font-weight:800;color:#123a6b;">Ficha Feedback — Núcleo Reposição</span></td>
        </tr>
      </table>
      <div style="font-size:9.5px;color:#7a8798;margin-bottom:8px;">Data de geração: ${hoje}</div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:6px;">
        <tr>${labelCellHtml("Cód. Funcionário Avaliado",16)}${valueCellHtml(employee.cod||"-",18)}${labelCellHtml("Nome Funcionário Avaliado",18)}${valueCellHtml(escapeHtml(employee.nome||"-"),48)}</tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
        <tr>${labelCellHtml("Cód. Avaliador",16)}${valueCellHtml(AVALIADOR_FIXO.codigo,18)}${labelCellHtml("Nome Avaliador",18)}${valueCellHtml(AVALIADOR_FIXO.nome,48)}</tr>
      </table>

      <div style="font-size:12px;font-weight:800;color:#123a6b;margin-bottom:5px;">📦 Histórico de Produção (O.S. 58)</div>
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        ${cardHtml("O.S. Dia Anterior", fmtNum(hist.osDiaAnterior), hist.ontem?fmtDateBR(hist.ontem):'-')}
        ${cardHtml("O.S. Última Semana", fmtNum(hist.osSemana))}
        ${cardHtml("O.S. Mês Anterior", fmtNum(hist.osMesAnterior), hist.mesAnteriorLabel)}
        ${cardHtml("O.S. Últimos 3 Meses", fmtNum(hist.os3Meses))}
      </div>

      <div style="font-size:12px;font-weight:800;color:#123a6b;margin-bottom:5px;">🔍 Qualidade — Auditoria (Últimos 3 Meses)</div>
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        ${cardHtml("% Qualidade (3m)",
          (employee.qualidade!==null && employee.qualidade!==undefined) ? fmtNum(employee.qualidade,1)+'%' : 'Sem auditoria no período',
          'Fonte: Gestão > Auditoria',
          (employee.qualidade===null||employee.qualidade===undefined) ? '#7a8798' : employee.qualidade>=90 ? '#1a9c62' : employee.qualidade>=70 ? '#e08a1f' : '#d64545')}
        ${(employee.qualMeses||[]).map(q=>cardHtml("% Qualidade "+q.rot, q.qualidade!==null?fmtNum(q.qualidade,1)+'%':'Sem auditoria', q.auditorias+' auditoria(s)',
          q.qualidade===null ? '#7a8798' : q.qualidade>=90 ? '#1a9c62' : q.qualidade>=70 ? '#e08a1f' : '#d64545')).join("")}
        ${cardHtml("% Qualidade Retornos (3m)", employee.retornoQual!==null&&employee.retornoQual!==undefined?fmtNum(employee.retornoQual,1)+'%':'Sem auditoria', (employee.retornoAud||0)+' auditoria(s) de retorno',
          (employee.retornoQual===null||employee.retornoQual===undefined) ? '#7a8798' : employee.retornoQual>=90 ? '#1a9c62' : employee.retornoQual>=70 ? '#e08a1f' : '#d64545')}
      </div>

      <div style="font-size:12px;font-weight:800;color:#123a6b;margin-bottom:5px;">📈 Indicadores de Desempenho — Comparação Modo Mês</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        ${cardHtml("O.S. Atual", fmtNum(exec?exec.totalAtual:0), cmp?cmp.labelAtual:'')}
        ${cardHtml("O.S. Mês Anterior (mesmo período)", fmtNum(cmp?cmp.anterior:0), cmp?cmp.labelAnterior:'')}
        ${cardHtml("Variação", cmp&&cmp.variacao!==null?fmtPct(cmp.variacao,1):'s/ base', null, cmp&&cmp.variacao>0?'#1a9c62':cmp&&cmp.variacao<0?'#d64545':'#7a8798')}
        ${cardHtml("Média Diária", exec?fmtNum(exec.mediaDiaria,1):'0', 'O.S./dia útil', '#e08a1f')}
      </div>

      <div style="display:flex;gap:10px;margin-bottom:10px;">
        <div style="flex:1;border:1px solid #dde3ea;border-radius:6px;padding:6px;">
          <div style="font-size:9.5px;font-weight:700;color:#123a6b;margin-bottom:3px;">Evolução Real + Projeção — ${proj?proj.mesAtual:''}</div>
          <canvas id="fbdoc-chart-evo-${idx}" width="680" height="200"></canvas>
        </div>
        <div style="flex:1;border:1px solid #dde3ea;border-radius:6px;padding:6px;">
          <div style="font-size:9.5px;font-weight:700;color:#123a6b;margin-bottom:3px;">Ano Atual — Mês a Mês com Projeção</div>
          <canvas id="fbdoc-chart-ano-${idx}" width="680" height="200"></canvas>
        </div>
      </div>

      ${(()=>{
        const ind = indData; // pré-calculado antes de alterar Production.state.employees
        if(!ind) return '';
        const meta = individualState.meta;
        const corte = individualState.linhaDeCorteMes;
        const metaDia = fmtNum(ind.metaDia,1);
        const necFmt = ind.mediaNecessaria!==null ? fmtNum(ind.mediaNecessaria,1) : '—';
        const necColor = ind.mediaNecessaria===null?'#7a8798'
          :ind.mediaNecessaria<=ind.metaDia?'#1a9c62'
          :ind.mediaNecessaria<=ind.mediaHistorica*1.5?'#e08a1f':'#2f6fce';
        // Texto motivacional baseado no status — sem palavras negativas
        const msgMeta = ind.projetadoRitmoAtual>=meta
          ? `🎯 No ritmo atual, já está projetando <strong style="color:#1a9c62;">${fmtNum(ind.projetadoRitmoAtual)} O.S.</strong> no mês — acima da meta! Continue assim.`
          : ind.projetadoRitmoAtual>=corte
          ? `💪 Você está acima da linha de corte. Com um esforço adicional de <strong style="color:#e08a1f;">${necFmt} O.S./dia</strong> nos próximos ${ind.diasRestantes} dias, você alcança a meta de ${fmtNum(meta)} O.S.!`
          : `🚀 Você tem ${ind.diasRestantes} dias úteis restantes. Mantendo <strong style="color:#2f6fce;">${necFmt} O.S./dia</strong>, você chegará à meta de ${fmtNum(meta)} O.S.!`;

        return `
        <div style="background:#f0f6ff;border:1px solid #c3d6f5;border-left:4px solid #2f6fce;border-radius:6px;padding:10px 14px;margin-bottom:10px;">
          <div style="font-size:11px;font-weight:800;color:#123a6b;margin-bottom:6px;">📋 Acompanhamento da Meta — ${ind.nome}</div>
          <div style="display:flex;gap:8px;margin-bottom:6px;">
            <div style="flex:1;background:#fff;border-radius:5px;padding:6px 8px;text-align:center;">
              <div style="font-size:8px;color:#7a8798;font-weight:700;text-transform:uppercase;">O.S. Atual</div>
              <div style="font-size:16px;font-weight:800;color:#123a6b;">${fmtNum(ind.osAtual)}</div>
              <div style="font-size:7.5px;color:#7a8798;">de ${fmtNum(meta)} na meta</div>
            </div>
            <div style="flex:1;background:#fff;border-radius:5px;padding:6px 8px;text-align:center;">
              <div style="font-size:8px;color:#7a8798;font-weight:700;text-transform:uppercase;">Dias Rest.</div>
              <div style="font-size:16px;font-weight:800;color:#123a6b;">${ind.diasRestantes}</div>
              <div style="font-size:7.5px;color:#7a8798;">de ${ind.diasUteisMes} úteis</div>
            </div>
            <div style="flex:1;background:#fff;border-radius:5px;padding:6px 8px;text-align:center;">
              <div style="font-size:8px;color:#7a8798;font-weight:700;text-transform:uppercase;">Ritmo Atual</div>
              <div style="font-size:16px;font-weight:800;color:#2f6fce;">${fmtNum(ind.mediaDiaMesAtual,1)}</div>
              <div style="font-size:7.5px;color:#7a8798;">O.S./dia</div>
            </div>
            <div style="flex:1;background:#fff;border-radius:5px;padding:6px 8px;text-align:center;">
              <div style="font-size:8px;color:#7a8798;font-weight:700;text-transform:uppercase;">Projeção</div>
              <div style="font-size:16px;font-weight:800;color:#2f6fce;">${fmtNum(ind.projetadoRitmoAtual)}</div>
              <div style="font-size:7.5px;color:#7a8798;">no ritmo atual</div>
            </div>
            <div style="flex:1;background:#fff;border-radius:5px;padding:6px 8px;text-align:center;">
              <div style="font-size:8px;color:#7a8798;font-weight:700;text-transform:uppercase;">⚡ Para a Meta</div>
              <div style="font-size:16px;font-weight:800;color:${necColor};">${necFmt}</div>
              <div style="font-size:7.5px;color:#7a8798;">O.S./dia nos próx. ${ind.diasRestantes}d</div>
            </div>
          </div>
          <div style="font-size:10px;color:#2f4e7a;background:#fff;border-radius:4px;padding:6px 10px;">${msgMeta}</div>
        </div>`;
      })()}

      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr>${labelCellHtml("Resumo Assunto Tratado:",100)}</tr>
        <tr>${blankCellHtml(100,26)}</tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;table-layout:fixed;">
        <tr><td colspan="7" style="width:100%;background:#eaeef3;border:1px solid #c3ccd6;padding:4px 7px;font-size:10px;font-weight:700;color:#123a6b;">Classificação Motivo Feedback:</td></tr>
        <tr>${checkItem("Má Conduta")}${checkItem("Insubordinação")}${checkItem("Ausência Injustificada")}${checkItem("Atrasos Frequentes")}${checkItem("Desrespeito às Regras")}${checkItem("Violação da Política Moral da Empresa")}${checkItem("Baixa Produção")}</tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr><td colspan="3" style="background:#d8e4f5;border:1px solid #c3ccd6;padding:4px 7px;font-size:10px;font-weight:800;color:#123a6b;">Avaliação Geral</td></tr>
        <tr>${labelCellHtml("Bom desempenho ( )",34)}${labelCellHtml("Regular, com margem p/ melhoria ( )",33)}${labelCellHtml("Desempenho insatisfatório ( )",33)}</tr>
        <tr>${blankCellHtml(34,24)}${blankCellHtml(33,24)}${blankCellHtml(33,24)}</tr>
      </table>

      <div style="background:#1a9c62;padding:5px 10px;margin-bottom:2px;"><span style="color:#fff;font-size:10.5px;font-weight:800;">AUTOAVALIAÇÃO — preenchida pelo Funcionário Avaliado</span></div>
      <div style="font-size:9px;color:#4a5568;font-style:italic;margin-bottom:3px;">O próprio funcionário avaliado deve marcar, de 0 a 10, a nota que representa sua autoavaliação de desempenho no período.</div>
      <div style="margin-bottom:8px;">${scaleRowHtml('#1a9c62')}</div>

      <div style="background:#e08a1f;padding:5px 10px;margin-bottom:2px;"><span style="color:#fff;font-size:10.5px;font-weight:800;">AVALIAÇÃO DO AVALIADOR — preenchida por ${AVALIADOR_FIXO.nome}</span></div>
      <div style="font-size:9px;color:#4a5568;font-style:italic;margin-bottom:3px;">O avaliador deve marcar, de 0 a 10, a nota que representa sua avaliação de desempenho do funcionário no período.</div>
      <div style="margin-bottom:14px;">${scaleRowHtml('#e08a1f')}</div>

      <div style="display:flex;gap:60px;margin-top:14px;">
        <div style="flex:1;text-align:center;">
          <div style="border-bottom:1px solid #333;padding-top:20px;margin-bottom:4px;"></div>
          <div style="font-size:9.5px;">Assinatura Avaliador</div>
        </div>
        <div style="flex:1;text-align:center;">
          <div style="border-bottom:1px solid #333;padding-top:20px;margin-bottom:4px;"></div>
          <div style="font-size:9.5px;">Assinatura Funcionário Avaliado</div>
        </div>
      </div>
    `;

    document.body.appendChild(el);
    return el;
  },

  renderCharts(proj, idx){
    if(!proj) return;
    idx = idx===undefined ? "" : idx;
    const evoCtx = document.getElementById("fbdoc-chart-evo-"+idx);
    const anoCtx = document.getElementById("fbdoc-chart-ano-"+idx);
    if(!evoCtx || !anoCtx) return;

    const dr = proj.diasReais;
    const corProj = proj.projecaoMaior ? "#1a9c62" : "#d64545";

    // índice do último ponto real e do último ponto de projeção (pra rotular só o final da linha,
    // já que rotular cada dia individualmente ficaria ilegível)
    let lastRealIdx = -1;
    dr.forEach((d,i)=>{ if(d.acumReal!==null) lastRealIdx = i; });
    const lastProjIdx = dr.length - 1;

    new Chart(evoCtx.getContext("2d"), {
      type:"line",
      data:{ labels: dr.map(d=>String(d.dia)), datasets:[
        { label:"Real", data: dr.map(d=>d.acumReal), borderColor:"#2f6fce", backgroundColor:"rgba(47,111,206,0.12)", fill:true, tension:.3, pointRadius:0, borderWidth:2 },
        { label:"Projeção", data: dr.map(d=>d.acumProj), borderColor: corProj, borderDash:[5,3], borderWidth:2, pointRadius:0, fill:false }
      ]},
      options:{ responsive:false, animation:false,
        plugins:{
          legend:{ labels:{ font:{size:9} }, position:"bottom" },
          datalabels:{
            color:(ctx)=> ctx.datasetIndex===0 ? "#2f6fce" : corProj,
            font:{ size:9, weight:"800" },
            align:(ctx)=> ctx.datasetIndex===0 ? "top" : "bottom",
            offset:4,
            formatter:(value, ctx)=>{
              const isLast = (ctx.datasetIndex===0 && ctx.dataIndex===lastRealIdx) || (ctx.datasetIndex===1 && ctx.dataIndex===lastProjIdx);
              if(!isLast || value===null) return "";
              return fmtNum(value);
            }
          }
        },
        scales:{ x:{ ticks:{ font:{size:8}, maxTicksLimit:8 }, grid:{display:false} }, y:{ ticks:{ font:{size:8} }, grid:{color:"#eaeef3"} } }
      }
    });

    // marcador de meta: ponto + rótulo mostrando onde a projeção do mês deve terminar
    const mesAtualIdx = MESES_PT.findIndex((_,m)=> this._monthlyTotalsColors[m] === "#e08a1f");
    const projecaoPontual = MESES_PT.map((_,m)=> m===mesAtualIdx ? proj.projecao : null);

    new Chart(anoCtx.getContext("2d"), {
      type:"bar",
      data:{ labels: MESES_PT, datasets:[
        { label:"O.S. 58", data: this._monthlyTotalsForChart, backgroundColor: this._monthlyTotalsColors, borderRadius:3 },
        { type:"line", label:"Projeção fechamento", data: projecaoPontual, borderColor: corProj, backgroundColor:"transparent", borderWidth:2, borderDash:[5,4], pointRadius:4, pointBackgroundColor:corProj }
      ]},
      options:{ responsive:false, animation:false,
        plugins:{
          legend:{ display:false },
          datalabels:{
            font:{ size:8.5, weight:"800" },
            formatter:(value, ctx)=>{
              if(value===null || value===undefined) return "";
              if(ctx.datasetIndex===1) return "🎯 "+fmtNum(value); // rótulo da meta/projeção
              return fmtNum(value);
            },
            color:(ctx)=> ctx.datasetIndex===1 ? corProj : "#123a6b",
            anchor:(ctx)=> ctx.datasetIndex===1 ? "end" : "end",
            align:(ctx)=> ctx.datasetIndex===1 ? "top" : "top",
            offset:3
          }
        },
        scales:{ x:{ ticks:{ font:{size:8} }, grid:{display:false} }, y:{ ticks:{ font:{size:8} }, grid:{color:"#eaeef3"} } }
      }
    });
  },

  async generate(employee){
    return this.generateMultiple([employee]);
  },

  // Gera 1 PDF único com 1 página por funcionário selecionado, cada página com os
  // indicadores/gráficos calculados individualmente para aquele funcionário.
  async generateMultiple(employees){
    if(typeof html2canvas === "undefined" || typeof window.jspdf === "undefined"){
      toast("As bibliotecas de exportação (html2canvas/jsPDF) ainda não carregaram. Aguarde e tente novamente.", "error");
      return;
    }
    if(!employees || !employees.length){
      toast("Nenhum funcionário selecionado.", "error");
      return;
    }
    toast(`Gerando Termo de Feedback (PDF) — ${employees.length} funcionário(s)...`);

    const containers = [];
    const savedEmp = Production.state.employees;
    try{
      for(let i=0; i<employees.length; i++){
        const employee = employees[i];
        const hist = computeEmployeeProductionHistory(employee.codKey);
        const snap = computeEmployeeProductionSnapshot(employee.codKey);

        // pré-calcula os totais mensais do ano atual para o funcionário (pro gráfico "Ano Atual")
        const maxDate = Production.maxDataDate();
        const anoAtual = maxDate ? maxDate.getFullYear() : new Date().getFullYear();
        const mesAtualIdx = maxDate ? maxDate.getMonth() : 0;
        const rowsEmp = window.APP_STATE.processed.p8460.filter(r=>r.tipoos===58 && r.codKey===employee.codKey);
        this._monthlyTotalsForChart = MESES_PT.map((_,m)=> rowsEmp.filter(r=>r.dtinicio.getFullYear()===anoAtual && r.dtinicio.getMonth()===m).length || null);
        this._monthlyTotalsColors = MESES_PT.map((_,m)=> m===mesAtualIdx ? "#e08a1f" : "#2f6fce");

        // computeIndividual DEVE ser chamado ANTES de setar Production.state.employees —
        // caso contrário maxDataDate() filtra só aquele funcionário, distorcendo diasRestantes.
        const indData = computeIndividual(employee.codKey, individualState.meta);

        // garante que Production.state.employees está setado no momento de renderCharts (usa snapshot para o rows filter)
        Production.state.employees = [employee.codKey];

        const container = this.buildContainer(employee, hist, snap, i, indData);
        this.renderCharts(snap.proj, i);
        containers.push(container);

        // dá um tick pro Chart.js terminar de desenhar antes de seguir pro próximo
        await new Promise(r=>setTimeout(r, 100));
      }
      Production.state.employees = savedEmp;

      const filename = employees.length===1
        ? "Feedback_" + (employees[0].nome||"funcionario").replace(/[^a-zA-Z0-9]+/g,"_")
        : "Feedback_" + employees.length + "_funcionarios";

      await Export.toPDFMultiPage(containers, filename, "landscape");
    }catch(err){
      console.error(err);
      toast("Falha ao gerar o documento: " + err.message, "error");
      Production.state.employees = savedEmp;
    } finally {
      containers.forEach(c=>{ if(c && c.parentNode) c.parentNode.removeChild(c); });
    }
  }
};

const Export = {
  currentArea(){
    const active = $(".view.active .pane.active") || $(".view.active");
    return active;
  },
  async toPNG(targetOverride, filenamePrefix){
    const target = targetOverride || this.currentArea();
    if(!target){ toast("Nada para exportar.","error"); return; }
    toast("Gerando imagem PNG...");
    // trava animações/transições antes do screenshot, para não capturar o pane/card
    // ainda no meio do fade-in (opacidade parcial) — ver .export-no-anim no CSS
    document.body.classList.add("export-no-anim");
    await new Promise(res=>requestAnimationFrame(()=>requestAnimationFrame(res)));
    try{
      const canvas = await html2canvas(target, { backgroundColor:"#f4f6f9", scale:2, useCORS:true });
      const link = document.createElement("a");
      link.download = `${filenamePrefix||'nucleo-reposicao'}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast("PNG exportado com sucesso.","success");
    }catch(err){
      console.error(err);
      toast("Falha ao exportar PNG: "+err.message,"error");
    }finally{
      document.body.classList.remove("export-no-anim");
    }
  },

  // Localiza os "blocos visuais" que não podem ser cortados ao meio (cards, gráficos,
  // tabelas, avisos, linhas grid-2/grid-3). Retorna, para cada bloco, seu offset
  // (top/bottom) em px CSS relativo ao topo do container exportado.
  findBreakUnits(target){
    const SELECTOR = ".panel-header, .cards-grid, .chart-wrap, .table-wrap, .hint-box, .warn-box, .toolbar, .grid-2, .grid-3, .heatmap-grid, [id^='av-table-']";
    const all = Array.from(target.querySelectorAll(SELECTOR));
    const targetTop = target.getBoundingClientRect().top;

    const outer = all.filter(el => !all.some(other => other !== el && other.contains(el)));

    let units = outer.map(el=>{
      // sobe pelo DOM para ver se algum ancestral tem av-page-break
      let node = el;
      let forceBreak = false;
      while(node && node !== target){
        if(node.classList && node.classList.contains('av-page-break')){ forceBreak = true; break; }
        node = node.parentElement;
      }
      const r = el.getBoundingClientRect();
      return { top: r.top - targetTop, bottom: r.bottom - targetTop,
               isHeader: el.classList.contains("panel-header"), forceBreak };
    }).filter(u => u.bottom > u.top).sort((a,b)=>a.top - b.top);

    // gruda o panel-header ao bloco seguinte, transferindo forceBreak
    const merged = [];
    for(let i=0;i<units.length;i++){
      const u = units[i];
      if(u.isHeader && units[i+1] && units[i+1].top >= u.bottom - 2){
        merged.push({ top:u.top, bottom: units[i+1].bottom,
                      forceBreak: u.forceBreak || units[i+1].forceBreak });
        i++;
      } else {
        merged.push({ top:u.top, bottom:u.bottom, forceBreak: u.forceBreak });
      }
    }
    return merged;
  },

  // Calcula os pontos de corte (em px do canvas) de forma que nenhum bloco visual seja
  // cortado ao meio — só quebra entre blocos. Blocos maiores que uma página inteira
  // (ex: tabela enorme) são a única exceção e são fatiados normalmente.
  computePageBreaks(units, maxPagePx, totalPx){
    const breaks = [0];
    let pageStart = 0;
    for(const u of units){
      if(u.bottom <= pageStart) continue;

      // quebra forçada — este bloco SEMPRE começa numa nova página
      if(u.forceBreak && u.top > pageStart){
        breaks.push(u.top);
        pageStart = u.top;
      }

      const height = u.bottom - u.top;
      if(height > maxPagePx){
        if(u.top > pageStart){ breaks.push(u.top); pageStart = u.top; }
        let cursor = pageStart;
        while(u.bottom - cursor > maxPagePx){
          cursor += maxPagePx;
          breaks.push(cursor);
        }
        pageStart = cursor;
        continue;
      }
      if(u.bottom - pageStart > maxPagePx){
        breaks.push(Math.max(u.top, pageStart));
        pageStart = Math.max(u.top, pageStart);
      }
    }
    let cursor = pageStart;
    while(totalPx - cursor > maxPagePx){
      cursor += maxPagePx;
      breaks.push(cursor);
    }
    if(breaks[breaks.length-1] < totalPx) breaks.push(totalPx);
    return breaks;
  },

  async toPDF(targetOverride, filenamePrefix){
    const target = targetOverride || this.currentArea();
    if(!target){ toast("Nada para exportar.","error"); return; }
    toast("Gerando PDF...");
    // Esconde temporariamente blocos marcados como .pdf-hide-geral (ex.: filtros
    // de "Relações Rep") só durante a captura do PDF geral do rodapé.
    const hiddenEls = Array.from(target.querySelectorAll(".pdf-hide-geral"));
    const prevDisplay = hiddenEls.map(el=>el.style.display);
    hiddenEls.forEach(el=>{ el.style.display="none"; });
    // trava animações/transições antes do screenshot, para não capturar o pane/card
    // ainda no meio do fade-in (opacidade parcial) — ver .export-no-anim no CSS
    document.body.classList.add("export-no-anim");
    await new Promise(res=>requestAnimationFrame(()=>requestAnimationFrame(res)));
    try{
      const scale = 2;
      const units = this.findBreakUnits(target);
      const canvas = await html2canvas(target, { backgroundColor:"#ffffff", scale, useCORS:true });
      hiddenEls.forEach((el,i)=>{ el.style.display = prevDisplay[i]; });
      document.body.classList.remove("export-no-anim");

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation:"landscape", unit:"mm", format:"a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const imgW = pageW - margin*2; // largura da imagem em mm (fixa)
      const mmPerCanvasPx = imgW / canvas.width; // fator de conversão canvas-px -> mm
      const maxPagePx = (pageH - margin*2) / mmPerCanvasPx; // altura útil de página, em canvas-px

      // converte offsets dos blocos (em px CSS) para px do canvas (aplicando o scale do html2canvas)
      const unitsCanvasPx = units.map(u=>({ top:u.top*scale, bottom:u.bottom*scale }));

      let pageBreaksPx = unitsCanvasPx.length
        ? this.computePageBreaks(unitsCanvasPx, maxPagePx, canvas.height)
        : null;

      // fallback: se por algum motivo não há blocos detectados, usa fatiamento fixo (comportamento antigo)
      if(!pageBreaksPx || pageBreaksPx.length < 2){
        pageBreaksPx = [];
        let cursor = 0;
        while(cursor < canvas.height){
          pageBreaksPx.push(cursor);
          cursor += maxPagePx;
        }
        pageBreaksPx.push(canvas.height);
      }

      const cropCanvas = document.createElement("canvas");
      const cropCtx = cropCanvas.getContext("2d");

      for(let i=0; i<pageBreaksPx.length-1; i++){
        const sliceTop = Math.round(pageBreaksPx[i]);
        const sliceBottom = Math.min(Math.round(pageBreaksPx[i+1]), canvas.height);
        const sliceHeightPx = sliceBottom - sliceTop;
        if(sliceHeightPx <= 0) continue;

        cropCanvas.width = canvas.width;
        cropCanvas.height = sliceHeightPx;
        cropCtx.clearRect(0,0,cropCanvas.width, cropCanvas.height);
        cropCtx.drawImage(canvas, 0, sliceTop, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

        const sliceImgH = sliceHeightPx * mmPerCanvasPx;
        if(i>0) pdf.addPage();
        pdf.addImage(cropCanvas.toDataURL("image/png"), "PNG", margin, margin, imgW, sliceImgH);
      }

      pdf.save(`${filenamePrefix||'nucleo-reposicao'}-${Date.now()}.pdf`);
      toast("PDF exportado com sucesso.","success");
    }catch(err){
      hiddenEls.forEach((el,i)=>{ el.style.display = prevDisplay[i]; });
      document.body.classList.remove("export-no-anim");
      console.error(err);
      toast("Falha ao exportar PDF: "+err.message,"error");
    }
  },

  // Exporta o elemento inteiro ESCALADO para caber em uma única página A4 (encolhe
  // proporcionalmente, ao contrário de toPDF que pagina mantendo tamanho real).
  async toPDFSinglePage(targetOverride, filenamePrefix, orientation){
    const target = targetOverride || this.currentArea();
    if(!target){ toast("Nada para exportar.","error"); return; }
    toast("Gerando PDF em 1 página...");
    document.body.classList.add("export-no-anim");
    await new Promise(res=>requestAnimationFrame(()=>requestAnimationFrame(res)));
    try{
      const canvas = await html2canvas(target, { backgroundColor:"#ffffff", scale:2, useCORS:true });
      const { jsPDF } = window.jspdf;
      const orient = orientation || "landscape";
      const pdf = new jsPDF({ orientation: orient, unit:"mm", format:"a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxW = pageW - margin*2;
      const maxH = pageH - margin*2;

      // escala proporcional para caber tanto na largura quanto na altura disponíveis
      const scaleByWidth = maxW / canvas.width;
      const scaleByHeight = maxH / canvas.height;
      const scaleFinal = Math.min(scaleByWidth, scaleByHeight);

      const imgW = canvas.width * scaleFinal;
      const imgH = canvas.height * scaleFinal;
      const x = margin + (maxW - imgW) / 2; // centraliza horizontalmente
      const y = margin;

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, imgW, imgH);
      pdf.save(`${filenamePrefix||'nucleo-reposicao'}-${Date.now()}.pdf`);
      toast("PDF (1 página) exportado com sucesso.","success");
    }catch(err){
      console.error(err);
      toast("Falha ao exportar PDF: "+err.message,"error");
    }finally{
      document.body.classList.remove("export-no-anim");
    }
  },

  // Gera UM ÚNICO PDF com várias páginas, cada elemento de "targets" vira 1 página inteira
  // (escalado pra caber sozinho na folha A4, igual toPDFSinglePage, mas tudo no mesmo arquivo).
  async toPDFMultiPage(targets, filenamePrefix, orientation){
    if(!targets || !targets.length){ toast("Nada para exportar.","error"); return; }
    toast(`Gerando PDF com ${targets.length} página(s)...`);
    document.body.classList.add("export-no-anim");
    await new Promise(res=>requestAnimationFrame(()=>requestAnimationFrame(res)));
    try{
      const { jsPDF } = window.jspdf;
      const orient = orientation || "landscape";
      const pdf = new jsPDF({ orientation: orient, unit:"mm", format:"a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxW = pageW - margin*2;
      const maxH = pageH - margin*2;

      for(let i=0; i<targets.length; i++){
        const canvas = await html2canvas(targets[i], { backgroundColor:"#ffffff", scale:2, useCORS:true });
        const scaleByWidth = maxW / canvas.width;
        const scaleByHeight = maxH / canvas.height;
        const scaleFinal = Math.min(scaleByWidth, scaleByHeight);
        const imgW = canvas.width * scaleFinal;
        const imgH = canvas.height * scaleFinal;
        const x = margin + (maxW - imgW) / 2;
        const y = margin;

        if(i>0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, imgW, imgH);
      }

      pdf.save(`${filenamePrefix||'nucleo-reposicao'}-${Date.now()}.pdf`);
      toast(`PDF com ${targets.length} página(s) exportado com sucesso.`,"success");
    }catch(err){
      console.error(err);
      toast("Falha ao exportar PDF: "+err.message,"error");
    }finally{
      document.body.classList.remove("export-no-anim");
    }
  }
};

/* ---------------------------------------------------------------------- */
/* TABLE SORT — ativa ordenação clicável em qualquer .data-table           */
/* ---------------------------------------------------------------------- */
function makeSortable(table){
  if(!table || table.dataset.sortable) return;
  table.dataset.sortable = "1";

  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  if(!thead || !tbody) return;

  const headers = Array.from(thead.querySelectorAll("th"));
  let lastCol = -1, lastDir = 0; // 0=none, 1=asc, -1=desc

  headers.forEach((th, colIdx)=>{
    th.addEventListener("click", ()=>{
      // determina direção
      if(lastCol === colIdx){
        lastDir = lastDir === 1 ? -1 : 1;
      } else {
        lastDir = 1;
        lastCol = colIdx;
      }

      // remove indicadores anteriores
      headers.forEach(h=>{ h.classList.remove("sort-asc","sort-desc"); });
      th.classList.add(lastDir===1 ? "sort-asc" : "sort-desc");

      // coleta linhas excluindo linhas de totais/rodapé (com colspan > 1)
      const rows = Array.from(tbody.querySelectorAll("tr")).filter(r=>{
        const cells = r.querySelectorAll("td");
        if(!cells.length) return false;
        // pula linhas com colspan (totais)
        return !Array.from(cells).some(td=>parseInt(td.getAttribute("colspan")||1)>1);
      });

      rows.sort((a,b)=>{
        const cellA = a.querySelectorAll("td")[colIdx];
        const cellB = b.querySelectorAll("td")[colIdx];
        if(!cellA || !cellB) return 0;

        // pega texto limpo (remove tags filhas como spans)
        const rawA = (cellA.textContent||"").trim();
        const rawB = (cellB.textContent||"").trim();

        // tenta parsear como número (aceita vírgula decimal BR, R$, %, +/-)
        const parseNum = s=>{
          const cleaned = s.replace(/[R$\s%+]/g,"").replace(/\./g,"").replace(",",".");
          const n = parseFloat(cleaned);
          return isNaN(n) ? null : n;
        };
        const numA = parseNum(rawA);
        const numB = parseNum(rawB);

        let cmp;
        if(numA !== null && numB !== null){
          cmp = numA - numB;
        } else {
          // string: normaliza para comparação sem acento
          const strA = rawA.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
          const strB = rawB.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
          cmp = strA < strB ? -1 : strA > strB ? 1 : 0;
        }
        return cmp * lastDir;
      });

      // reinsere linhas ordenadas (mantém linhas de total no lugar)
      const allRows = Array.from(tbody.querySelectorAll("tr"));
      const totalRows = allRows.filter(r=>{
        const cells = r.querySelectorAll("td");
        return Array.from(cells).some(td=>parseInt(td.getAttribute("colspan")||1)>1);
      });

      // remove todas as linhas normais do tbody
      rows.forEach(r=>r.remove());
      // reinsere na ordem certa (antes das linhas de total se existirem)
      if(totalRows.length){
        totalRows[0].before(...rows);
      } else {
        tbody.append(...rows);
      }
    });
  });
}

// Activa automaticamente em todas as .data-table do documento (MutationObserver)
function activateSortableAll(){
  document.querySelectorAll("table.data-table").forEach(makeSortable);
}
// Observa mudanças no DOM para ativar em tabelas criadas dinamicamente
let _sortPend = false;   // agrupa várias mutações num único passe (evita travar com tabelas grandes)
const _sortObs = new MutationObserver(()=>{
  if(_sortPend) return;
  _sortPend = true;
  requestAnimationFrame(()=>{ _sortPend = false; activateSortableAll(); });
});

/* ---------------------------------------------------------------------- */
/* MODULE: UI                                                              */
/* ---------------------------------------------------------------------- */
const UI = {
  subnavConfig: {
    indicadores: [
      { id:"producao", label:"Produção" },
      { id:"projecao", label:"Projeção" },
      { id:"individual", label:"Acompanhamento Individual" },
      { id:"avaria", label:"Avaria XML" },
      { id:"operadores", label:"Produção Operadores" },
      { id:"relacoes", label:"Relações Rep" },
      { id:"capacidade", label:"Capacidade CD" },
      { id:"abastecimento", label:"Nível Abastecimento" },
      { id:"cd3d", label:"NVL 3D" }
    ],
    gestao: [
      { id:"feedbacks", label:"Feedbacks e Advertências", aliases:["Feedbacks"] },
      { id:"quadro", label:"Quadro" },
      { id:"chamada", label:"Chamada" },
      { id:"auditoria", label:"Auditoria" },
      { id:"comissao", label:"Comissão" },
      { id:"cronograma", label:"Cronograma" },
      { id:"turnover", label:"Turnover" },
      { id:"ferias", label:"Férias" },
      { id:"organograma", label:"Organograma" }
    ],
    lancamentos: [
      { id:"lfeedback", label:"Lançar Feedback" },
      { id:"ladvertencia", label:"Lançar Advertência" },
      { id:"lavaria", label:"Lançar Avaria 9712", aliases:["Lançar REP.AVARIA"] },
      { id:"lchamada", label:"Lançar Chamada" },
      { id:"lquadro", label:"Lançar Quadro" },
      { id:"lmissoes", label:"Lançar Missões" },
      { id:"lcapacidade", label:"Lançar Capacidade" },
      { id:"lferias", label:"Lançar Férias" }
    ],
    admin: [
      { id:"bases", label:"Bases" },
      { id:"acessos", label:"Acessos" },
      { id:"links", label:"Links de acesso" }
    ]
  },

  // sub abas que o usuário logado pode ver (permissões vêm da planilha "Logins e Permissões")
  itemsFor(view){ return (this.subnavConfig[view]||[]).filter(it=>Auth.can(view, it.id)); },

  // vai para uma categoria (e sub aba, se informada) — usado pelo menu lateral e pela barra inferior
  goTo(view, pane){
    if(!Auth.can(view, pane || (this.itemsFor(view)[0]||{}).id)) return;
    if(!window.APP_STATE.ready && $("#main-content").style.display!=="block"){
      $("#empty-state").style.display = "none"; $("#main-content").style.display = "block";   // navega mesmo sem dados (cada tela explica o que falta)
    }
    if(view===this.currentView && pane){ this.switchPane(pane); return; }
    this.switchView(view, true, pane);
  },

  // se a view atual não é permitida para este usuário, vai para a primeira que for
  garantirViewPermitida(){
    if(this.itemsFor(this.currentView).length && Auth.can(this.currentView, this.currentPane)) return;
    const v = Nav.firstView();
    if(!v) return;
    this.currentView = v;
    this.currentPane = this.itemsFor(v)[0].id;
    $all(".view").forEach(x=>x.classList.remove("active"));
    $all(".pane").forEach(x=>x.classList.remove("active"));
    const vw = $("#view-"+v), pn = $("#pane-"+this.currentPane);
    if(vw) vw.classList.add("active");
    if(pn) pn.classList.add("active");
    this.buildSubnav();
  },
  currentView: "indicadores",
  currentPane: "producao",

  init(){
    // ativa ordenação em tabelas existentes e futuras
    _sortObs.observe(document.body, { childList:true, subtree:true });
    activateSortableAll();

    $("#btn-reload").addEventListener("click", ()=> $("#file-input").click());
    $("#btn-empty-upload").addEventListener("click", ()=> $("#file-input").click());
    $("#btn-empty-online").addEventListener("click", ()=> this.carregarOnline());
    $("#btn-refresh-online").addEventListener("click", ()=> this.carregarOnline());
    $("#btn-ir-avaria").addEventListener("click", ()=> abrirAvariaSemArquivo());
    $("#btn-ir-cd3d").addEventListener("click", ()=> abrirCD3DSemArquivo());
    $("#btn-ir-admin").addEventListener("click", ()=> abrirAdminSemDados());
    Nav.initDrawer();
    $("#sb-logout").addEventListener("click", ()=> Auth.logout());
    $("#sb-refresh").addEventListener("click", ()=> this.carregarOnline());
    $("#sb-arquivo").addEventListener("click", ()=> $("#file-input").click());
    $("#hdr-logout").addEventListener("click", ()=> Auth.logout());
    $("#file-input").addEventListener("change", (e)=>{
      if(e.target.files[0]) this.handleFile(e.target.files[0]);
    });
    $("#btn-export-png").addEventListener("click", ()=>Export.toPNG());
    $("#btn-export-pdf").addEventListener("click", ()=>Export.toPDF());
    $("#modal-overlay").addEventListener("click", (e)=>{ if(e.target.id==="modal-overlay") this.closeModal(); });
    this.garantirViewPermitida();
    this.buildSubnav();
    Nav.render();

    // ao abrir o site (já logado), busca tudo direto do Google Sheets
    const iniciar = ()=> this.carregarOnline();
    // sessão salva: o login já "entrou" (e disparou loginOk) antes deste ponto — não esperar um evento que já passou
    if(document.body.classList.contains("locked") && !LoginModule.entrou) document.addEventListener("loginOk", iniciar, { once:true });
    else iniciar();
  },

  // carga manual (plano B): arquivo Excel escolhido pelo usuário
  async handleFile(file){
    return this.importar({ name:file.name, online:false }, ()=> ExcelLoader.load(file));
  },

  // carga principal: todas as abas direto do Google Sheets, sem arquivo
  async carregarOnline(){
    if(this._carregandoOnline) return;
    this._carregandoOnline = true;
    try{
      await this.importar({ name:"Google Sheets (online)", online:true }, ()=>{
        return ExcelLoader.loadOnline((feitas,total,nome,info)=> LoadingScreen.progresso(feitas,total,nome,info));
      });
    } finally { this._carregandoOnline = false; }
  },

  async importar(file, lerRaw){
    $("#empty-error").innerHTML = "";
    const naLogin = document.body.classList.contains("locked");   // 1º carregamento, ainda na tela de entrada
    LoadingScreen.show(file.name, naLogin ? "login" : "painel");
    let stage = file.online ? "leitura da planilha online (Google Sheets)" : "leitura do arquivo (Excel Loader)";
    try{
      await LoadingScreen.step("recebido", 5);
      await LoadingScreen.step("lendo", 20);
      const raw = await lerRaw();

      await LoadingScreen.step("validando", 45);

      stage = "processamento dos dados (Data Processor)";
      await LoadingScreen.step("sheets", 60);
      const processed = DataProcessor.process(raw);

      stage = "identificação do quadro atual (Current Team)";
      const currentTeam = CurrentTeam.compute(processed);

      stage = "montagem do cadastro de nomes";
      const nameRegistry = buildNameRegistry(processed);

      await LoadingScreen.step("processando", 85);

      window.APP_STATE.raw = raw;
      window.APP_STATE.processed = processed;
      window.APP_STATE.currentTeam = currentTeam;
      window.APP_STATE.nameRegistry = nameRegistry;
      window.APP_STATE.commissionConfig = JSON.parse(JSON.stringify(DEFAULT_COMMISSION_CONFIG));
      window.APP_STATE.ready = true;
      if(window.FeedbackAdv) FeedbackAdv.atualizarAlertas();

      // inicializa o Cronograma a partir da sheet CRONOGRAMA (se existir) — continua 100% editável na tela depois
      CronogramaState.activities = processed.cronogramaSheet.map(r=>({
        id: "cr_"+r._row+"_"+Date.now(),
        nome: r.nome, horaInicioMin: r.horaInicioMin, horaFimMin: r.horaFimMin, prioridade: r.prioridade
      }));

      let badgeText = "Quadro atual: " + (currentTeam.date ? fmtDateBR(currentTeam.date) : "-") +
        "  •  " + currentTeam.repositorCodes.size + " repositores";
      if(currentTeam.cargoDisponivel){
        const extras = [];
        if(currentTeam.cargoCounts.AUXILIAR>0) extras.push(currentTeam.cargoCounts.AUXILIAR+" Auxiliar"+(currentTeam.cargoCounts.AUXILIAR>1?'es':''));
        if(currentTeam.cargoCounts.LIDER>0) extras.push(currentTeam.cargoCounts.LIDER+" Líder"+(currentTeam.cargoCounts.LIDER>1?'es':''));
        if(currentTeam.cargoCounts.OUTRO>0) extras.push(currentTeam.cargoCounts.OUTRO+" outro(s) cargo(s)");
        if(currentTeam.cargoCounts.NAO_INFORMADO>0) extras.push(currentTeam.cargoCounts.NAO_INFORMADO+" sem cargo informado");
        if(extras.length) badgeText += " (+" + extras.join(", ") + ")";
      }

      await LoadingScreen.step("finalizando", 100);
      stage = "leitura das bases de auditoria (Auditoria_Ruas / Auditoria_Retorno)";
      // atualiza as bases de auditoria junto com a carga, para aparecerem no log (falha não trava a carga)
      try{
        await Promise.all([
          AuditOnline.load(true),
          (typeof RetornoQ!=="undefined" ? RetornoQ.carregar(true) : null)
        ]);
      }catch(_){}
      stage = "montagem do log de importação";
      if(!naLogin) LoadingScreen.hide();

      // Só revela o dashboard quando o usuário clicar em "Acessar Dashboard" na
      // tela de log — até lá, a interface continua na tela de boas-vindas por trás
      // do overlay, então nunca aparece "meio carregada".
      const jaAberto = $("#main-content").style.display === "block";
      const abrirPainel = () => {
          $("#quadro-badge").textContent = badgeText;
          $("#empty-state").style.display = "none";
          $("#main-content").style.display = "block";
          $("#btn-export-png").disabled = false;
          $("#btn-export-pdf").disabled = false;

          const gestaoBtn = $(".nav-btn[data-view='gestao']");
          if(gestaoBtn){ gestaoBtn.style.opacity=""; gestaoBtn.style.pointerEvents=""; gestaoBtn.title=""; }
          const hint = document.getElementById('avaria-sem-arquivo-hint');
          if(hint) hint.remove();

          const abas = Object.keys(raw||{}).filter(k=>Array.isArray(raw[k]));
          const linhasTot = abas.reduce((n,k)=>n+raw[k].length,0);
          toast(file.online ? "Dados atualizados" : "Arquivo carregado", "success", { sub: `${abas.length} abas · ${linhasTot.toLocaleString("pt-BR")} linhas · ${file.online ? "Google Sheets" : file.name}` });
          if(window.Design) Design.marcarAtualizacao(file.online ? "online" : "arquivo");
          if(jaAberto && Auth.can(this.currentView, this.currentPane)) this.switchView(this.currentView, true, this.currentPane);
          else this.switchView(Nav.firstView()||"indicadores", true);
          $("#file-input").value = "";
      };
      const temAlerta = file.online && ImportLog.buildLog(raw).some(s=>s.status==="alerta" && !/nenhuma coluna de data/.test(s.msg||""));
      const avisarAlerta = ()=>{ if(temAlerta) toast("Alguns dados vieram com alerta", "info", { sub:"Algumas abas não carregaram como esperado.", duracao:9000,
        acao:{ rotulo:"Ver detalhes", fn:()=> ImportLog.show(file, raw, ()=>{}, ()=>{ $("#file-input").value=""; $("#file-input").click(); }) } }); };
      if(naLogin){
        // tela de entrada: resumo mínimo no canto e entra sozinho (3 s; 5 s se houver alertas) se ninguém clicar
        await new Promise(res=> Design.carga.resumo(file, ImportLog.buildLog(raw), temAlerta ? 5 : 3, res));
        LoginModule.liberar();
        abrirPainel(); avisarAlerta();
      } else if(file.online){
        abrirPainel(); avisarAlerta();
      } else {
        ImportLog.show(file, raw, abrirPainel,
          /* onLoadAnother */ () => {
            $("#file-input").value = "";
            $("#file-input").click();
          }
        );
      }
    }catch(err){
      console.error("[Central de Reposição] Erro na etapa:", stage, err);
      LoadingScreen.hide();
      if(naLogin) LoginModule.liberar();
      const msg = (err && err.message) ? err.message : String(err);
      const stackHint = (err && err.stack) ? err.stack.split("\n").slice(0,4).join("\n") : "";
      $("#empty-error").innerHTML = `<div class="error-box" style="text-align:left;margin-top:18px;white-space:pre-line;">` +
        `<strong>Falha na etapa: ${escapeHtml(stage)}</strong>\n\n${escapeHtml(msg)}` +
        (stackHint ? `<details style="margin-top:10px;white-space:normal;"><summary style="cursor:pointer;font-weight:700;">Detalhes técnicos</summary><pre style="white-space:pre-wrap;font-size:11.5px;margin:8px 0 0;">${escapeHtml(stackHint)}</pre></details>` : "") +
        `</div>`;
      toast(file.online ? "Não consegui buscar os dados" : "Não consegui ler o arquivo", "error", {
        sub: msg.split("\n")[0].slice(0,140),
        acao: file.online ? { rotulo:"Tentar de novo", fn:()=> UI.carregarOnline() } : null
      });
      // garante que a interface não fica "meio carregada"
      window.APP_STATE.ready = false;
      $("#file-input").value = "";
    }
  },

  buildSubnav(){
    const nav = $("#sub-nav");
    nav.innerHTML = "";
    const items = this.itemsFor(this.currentView);
    if(!items.length){ nav.classList.remove("show"); return; }
    nav.classList.add("show");
    items.forEach(it=>{
      const btn = document.createElement("button");
      btn.className = "subnav-btn" + (it.id===this.currentPane ? " active" : "");
      btn.dataset.pane = it.id;
      btn.textContent = it.label;
      btn.addEventListener("click", ()=>this.switchPane(it.id));
      nav.appendChild(btn);
    });
  },

  switchView(view, force, pane){
    if(view===this.currentView && !force) return;
    const items = this.itemsFor(view);
    if(!items.length){ toast("Você não tem acesso a esta área.","error"); return; }
    this.currentView = view;
    $all(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
    $all(".view").forEach(v=>v.classList.remove("active"));
    $all(".pane").forEach(p=>p.classList.remove("active")); // limpa panes de QUALQUER view
    $("#view-"+view).classList.add("active");
    this.currentPane = (pane && items.some(i=>i.id===pane)) ? pane : items[0].id;
    this.buildSubnav();
    $("#pane-"+this.currentPane).classList.add("active");   // visível antes de desenhar os gráficos
    this.renderPane(this.currentPane);
    Charts.resizeAll();
    Nav.sync();
    window.scrollTo(0,0);
  },

  switchPane(pane){
    if(!Auth.can(this.currentView, pane)) return;
    this.currentPane = pane;
    $all(".subnav-btn").forEach(b=>{
      b.classList.toggle("active", b.dataset.pane===pane);
    });
    $all(".pane").forEach(p=>p.classList.remove("active"));
    $("#pane-"+pane).classList.add("active");
    this.renderPane(pane);
    Charts.resizeAll();
    Nav.sync();
    window.scrollTo(0,0);
  },

  renderPane(pane){
    // avaria não depende do arquivo Núcleo Reposição — sempre pode renderizar
    if(!window.APP_STATE.ready && !['avaria','cd3d','bases','acessos','links','lfeedback','ladvertencia','lavaria','lchamada','lquadro','lmissoes','lcapacidade','lferias'].includes(pane)){
      const el = $("#pane-"+pane);
      if(el) el.innerHTML = `<div class="panel"><h3 class="adm-h2">Dados ainda não carregados</h3><p class="small-muted">O painel precisa dos dados do Google Sheets para mostrar esta área.</p><button type="button" class="btn btn-primary" onclick="UI.carregarOnline()">Buscar dados online</button></div>`;
      return;
    }
    const fns = {
      producao: renderProducao, projecao: renderProjecao, feedbacks: renderFeedbacks,
      quadro: renderQuadro, chamada: renderChamada, auditoria: renderAuditoria, comissao: renderComissao,
      cronograma: renderCronograma, cd3d: renderCD3D, individual: renderIndividual, turnover: renderTurnover, ferias: renderFerias, organograma: renderOrganograma, avaria: renderAvaria, operadores: renderOperadores, relacoes: renderRelacoes, capacidade: renderCapacidadeCD, abastecimento: renderAbastecimentoPicking,
      bases: ()=>window.AdminUI && AdminUI.renderBases(), acessos: ()=>window.AdminUI && AdminUI.renderAcessos(), links: ()=>window.AdminUI && AdminUI.renderLinks(),
      lfeedback: ()=>window.LancUI && LancUI.renderFeedback(), ladvertencia: ()=>window.LancUI && LancUI.renderAdvertencia(), lferias: ()=>window.LancUI && LancUI.renderFerias(), lavaria: ()=>window.LancUI && LancUI.renderAvaria(), lchamada: ()=>window.LancUI && LancUI.renderChamada(),
      lquadro: ()=>window.LancUI && LancUI.renderQuadro(), lmissoes: ()=>window.LancUI && LancUI.renderMissoes(), lcapacidade: ()=>window.LancUI && LancUI.renderCapacidade()
    };
    if(fns[pane]) fns[pane]();
  },

  openModal(html){
    $("#modal-box").innerHTML = `<button class="modal-close" onclick="UI.closeModal()">&times;</button>` + html;
    $("#modal-overlay").classList.add("show");
  },
  closeModal(){ $("#modal-overlay").classList.remove("show"); }
};

document.addEventListener("libsLoaded", () => {
  // registra o plugin de rótulos de dados (valores sempre visíveis nos gráficos,
  // essencial para impressão/PDF onde o hover do mouse não existe)
  if(typeof Chart !== "undefined" && typeof window.ChartDataLabels !== "undefined"){
    Chart.register(window.ChartDataLabels);
  }
  UI.init();
});

document.addEventListener("libsError", (e) => {
  // mostra erro de CDN antes mesmo de clicar em carregar arquivo
  const box = document.getElementById("empty-error");
  if(box){
    box.innerHTML = `<div class="error-box" style="text-align:left;margin-top:18px;">
      <strong>Não foi possível carregar uma ou mais bibliotecas necessárias.</strong><br><br>
      Detalhe: ${escapeHtml(e.detail || "erro desconhecido")}<br><br>
      Verifique sua conexão com a internet e recarregue a página (F5).<br>
      Se o problema persistir, tente em outro navegador ou desative extensões de bloqueio de anúncios.
    </div>`;
  }
});

/* ---------------------------------------------------------------------- */
/* RENDER: Produção                                                        */
/* ---------------------------------------------------------------------- */
function allEmployeesForProduction(){
  const processed = window.APP_STATE.processed;
  const registry = window.APP_STATE.nameRegistry;
  let codes = uniq(processed.p8460.filter(r=>r.tipoos===58).map(r=>r.codKey));
  if(Production.state.quadroAtual === "SIM"){
    const currentCodes = window.APP_STATE.currentTeam.codes;
    codes = codes.filter(c=>currentCodes.has(c));
  }
  return codes.map(c=>({ codKey:c, nome: registry.get(c)||c })).sort((a,b)=>a.nome.localeCompare(b.nome));
}

// =========================================================
// Helper centralizado de atalhos de período — usa a data
// REAL do sistema (new Date()), não maxDate dos dados.
// tipo: 'mes_atual' | 'mes_ant' | 'ano_atual' | 'ano_ant' | 'tudo'
// retorna {ini: Date, fim: Date} — fim = último ms do dia
// =========================================================
// Funções ponte — chamadas pelos botões de atalho de cada módulo
function atalhoProducao(tipo){
  const {ini,fim}=periodoAtalho(tipo);
  Production.state.dataInicial=ini; Production.state.dataFinal=fim;
  renderProducao();
}
function atalhoQuadro(tipo){
  const {ini,fim}=periodoAtalho(tipo);
  QuadroState.dataInicial=ini; QuadroState.dataFinal=fim;
  renderQuadro();
}
function atalhoComissao(tipo){
  const {ini,fim}=periodoAtalho(tipo);
  CommissionState.dataInicial=ini; CommissionState.dataFinal=fim; CommissionState.padraoAplicado=true;
  renderComissao();
}
function atalhoOp8457(tipo){
  const {ini,fim}=periodoAtalho(tipo);
  Op8457State.ini=ini; Op8457State.fim=fim;
  renderOperadores();
}
function atalhoTurnover(tipo){
  const {ini,fim}=periodoAtalho(tipo);
  TurnoverState.filtroIni = ini; TurnoverState.filtroFim = fim; TurnoverState.atalhoSel = tipo;
  renderTurnover();
}


// Detecta qual atalho está ativo comparando as datas (dia local, sem UTC)
function _ymd(d){ return d? d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate() : ''; }
function atalhoAtivoPorDatas(ini,fim,tipos){
  tipos = tipos || ['mes_atual','mes_ant','ano_atual','ano_ant','ultimos_3m'];
  if(!ini && !fim) return 'tudo';
  for(const t of tipos){
    if(t==='tudo'||t==='ultimos_30'||t==='ultimos_90') continue;
    const p=periodoAtalho(t);
    if(_ymd(p.ini)===_ymd(ini) && _ymd(p.fim)===_ymd(fim)) return t;
  }
  return null;
}

function periodoAtalho(tipo){
  const h = new Date();
  const y = h.getFullYear(), m = h.getMonth();
  if(tipo==='mes_atual')  return { ini: new Date(y,m,1),     fim: new Date(y,m+1,0,23,59,59) };
  if(tipo==='mes_ant')    return { ini: new Date(y,m-1,1),   fim: new Date(y,m,0,23,59,59)   };
  if(tipo==='ano_atual')  return { ini: new Date(y,0,1),     fim: new Date(y,11,31,23,59,59)  };
  if(tipo==='ano_ant')    return { ini: new Date(y-1,0,1),   fim: new Date(y-1,11,31,23,59,59)};
  // 3 meses completos anteriores ao mês atual (não inclui o mês atual)
  if(tipo==='ultimos_3m') return { ini: new Date(y,m-3,1),   fim: new Date(y,m,0,23,59,59)    };
  if(tipo==='ultimos_30') return { ini: addDays(h,-30),      fim: h };
  if(tipo==='ultimos_90') return { ini: addDays(h,-90),      fim: h };
  return { ini: null, fim: null }; // tudo
}

// Renderiza bloco de atalhos padronizado.
// selected = 'mes_atual' | 'mes_ant' | 'tudo' etc. | null
// onclickFn = nome da função JS a chamar com o tipo como string
function renderAtalhos(selected, onclickFn, opcoes){
  opcoes = opcoes || ['mes_atual','mes_ant','ano_atual','ano_ant','tudo'];
  const labels = {mes_atual:'Mês Atual', mes_ant:'Mês Anterior', ano_atual:'Ano Atual', ano_ant:'Ano Anterior', ultimos_3m:'Últimos 3 Meses', ultimos_30:'Últimos 30 Dias', ultimos_90:'Últimos 90 Dias', tudo:'Tudo'};
  return opcoes.map(t=>{
    const ativo = selected===t;
    return `<button
      onclick="${onclickFn}('${t}')"
      style="padding:5px 12px;font-size:11px;font-weight:${ativo?'800':'600'};border-radius:6px;border:1.5px solid ${ativo?'#0b2647':'#b8c4d4'};
             background:${ativo?'#0b2647':'#fff'};color:${ativo?'#fff':'#1a4480'};
             cursor:pointer;transition:all .15s;"
      title="${labels[t]}">${labels[t]}</button>`;
  }).join('');
}

function renderProducao(){
  const pane = $("#pane-producao");
  const st = Production.state;
  const employees = allEmployeesForProduction();

  pane.innerHTML = `
    <div class="toolbar">
      <div class="filter-group">
        <label>Modo</label>
        <div class="toggle-group" id="prod-mode-toggle">
          <button data-v="dia" class="${st.mode==='dia'?'active':''}">Dia</button>
          <button data-v="semana" class="${st.mode==='semana'?'active':''}">Semana</button>
          <button data-v="mes" class="${st.mode==='mes'?'active':''}">Mês</button>
        </div>
      </div>
      <div class="filter-group">
        <label>Data Inicial</label>
        <input type="date" id="prod-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}">
      </div>
      <div class="filter-group">
        <label>Data Final</label>
        <input type="date" id="prod-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}">
      </div>
      <div class="filter-group" style="min-width:200px;">
        <label>Funcionário</label>
        <select id="prod-employees">
          <option value="">Todos</option>
          ${employees.map(e=>`<option value="${e.codKey}" ${st.employees[0]===e.codKey?'selected':''}>${escapeHtml(e.nome)}</option>`).join("")}
        </select>
      </div>
      <div class="filter-group">
        <label>Quadro Atual?</label>
        <div class="toggle-group" id="prod-quadro-toggle">
          <button data-v="SIM" class="${st.quadroAtual==='SIM'?'active':''}">Sim</button>
          <button data-v="NAO" class="${st.quadroAtual==='NAO'?'active':''}">Não</button>
        </div>
      </div>
      ${st.mode==="semana" ? `
      <div class="filter-group">
        <label>Comparar semana com</label>
        <div class="toggle-group" id="prod-week-compare">
          <button data-v="anterior" class="${st.weekCompareMode==='anterior'?'active':''}">Semana anterior</button>
          <button data-v="mesCorrespondente" class="${st.weekCompareMode==='mesCorrespondente'?'active':''}">Mês anterior</button>
        </div>
      </div>` : ``}
      ${st.mode==="mes" ? `
      <div class="filter-group">
        <label>Mesma periodicidade?</label>
        <div class="toggle-group" id="prod-periodicidade">
          <button data-v="SIM" class="${st.mesmaPeriodicidade==='SIM'?'active':''}">Sim</button>
          <button data-v="NAO" class="${st.mesmaPeriodicidade==='NAO'?'active':''}">Não</button>
        </div>
      </div>` : ``}
      <div class="filter-group">
        <label>Atalhos</label>
        <div id="prod-atalhos" style="display:flex;gap:4px;flex-wrap:wrap;">
          ${renderAtalhos(atalhoAtivoPorDatas(st.dataInicial,st.dataFinal,['mes_atual','mes_ant']),'atalhoProducao',['mes_atual','mes_ant','tudo'])}
        </div>
      </div>
      <div class="spacer"></div>
      <button class="btn btn-outline btn-sm" id="prod-clear">Limpar filtros</button>
    </div>

    <div id="prod-empty-msg"></div>
    <div id="prod-content"></div>
  `;


  $("#prod-mode-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    st.mode = b.dataset.v; renderProducao();
  });
  $("#prod-quadro-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    st.quadroAtual = b.dataset.v;
    // se o funcionário selecionado não pertence mais à lista válida (ex: saiu do quadro
    // atual), limpa a seleção para não deixar um filtro "fantasma" aplicado sem aparecer na tela
    if(st.employees.length){
      const validCodes = new Set(allEmployeesForProduction().map(e=>e.codKey));
      if(!validCodes.has(st.employees[0])) st.employees = [];
    }
    renderProducao();
  });
  const wc = $("#prod-week-compare"); if(wc) wc.addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    st.weekCompareMode = b.dataset.v; renderProducao();
  });
  const pd = $("#prod-periodicidade"); if(pd) pd.addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    st.mesmaPeriodicidade = b.dataset.v; renderProducao();
  });
  $("#prod-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderProducao(); });
  $("#prod-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderProducao(); });
  $("#prod-employees").addEventListener("change", e=>{
    st.employees = e.target.value ? [e.target.value] : []; renderProducao();
  });
  $("#prod-clear").addEventListener("click", ()=>{
    Production.state = { mode:"mes", dataInicial:null, dataFinal:null, employees:[], quadroAtual:"NAO", weekCompareMode:"anterior", mesmaPeriodicidade:"SIM", projectionBase:1, dailyChartMes:1 };
    renderProducao();
  });

  const rows = Production.getBaseRows();
  if(!rows.length){
    $("#prod-empty-msg").innerHTML = `<div class="warn-box">Nenhum registro de produção (TIPOOS = 58) encontrado para os filtros selecionados na sheet 8460.</div>`;
    $("#prod-content").innerHTML = "";
    return;
  }

  renderProducaoContent();
}

function toInputDate(d){
  const dd = String(d.getDate()).padStart(2,"0"), mm = String(d.getMonth()+1).padStart(2,"0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function renderProducaoContent(){
  const exec = Production.executiveSummary();
  const cmp = Production.modeComparison();
  const yearCmp = Production.yearComparison();
  const ytd = Production.ytd();
  const daily = Production.dailySeriesForChart();

  // Duas projeções fixas — sempre presentes no topo independente do filtro "Base" do painel:
  //   projMesAtual  → base = média dos dias úteis já passados neste mês (projectionBase=0)
  //   projMesAnterior → base = média completa do mês anterior (projectionBase=1)
  // Salva e restaura o projectionBase do usuário para não alterar o estado selecionado.
  const savedBase = Production.state.projectionBase;
  Production.state.projectionBase = 0;
  const projMesAtual = Production.projection();
  Production.state.projectionBase = 1;
  const projMesAnterior = Production.projection();
  Production.state.projectionBase = savedBase;
  const weekly = Production.weeklyTable();
  const proj = Production.projection();

  // Respeita mesma periodicidade no gráfico/tabela mensal
  const mp = Production.state.mesmaPeriodicidade === "SIM";
  const maxDate = Production.maxDataDate();
  const evo = Production.monthlyEvolutionWithPeriod(mp ? maxDate : null);

  // badge intervalo de dados filtrados
  const filtRows = Production.getFilteredRows();
  const filtDates = filtRows.map(r=>r.dtinicio).filter(Boolean);
  const filtMin = filtDates.length ? new Date(Math.min(...filtDates.map(d=>d.getTime()))) : null;
  const filtMax = filtDates.length ? new Date(Math.max(...filtDates.map(d=>d.getTime()))) : null;
  const intervaloBadge = (filtMin && filtMax && (Production.state.dataInicial || Production.state.dataFinal || Production.state.employees.length))
    ? `<div class="hint-box">📅 Filtro ativo: <strong>${fmtDateBR(filtMin)}</strong> até <strong>${fmtDateBR(filtMax)}</strong> — ${filtRows.length} O.S. 58${Production.state.employees.length?' · '+Production.state.employees.length+' funcionário(s)':''}</div>`
    : `<div class="hint-box">📅 Período: <strong>${filtMin?fmtDateBR(filtMin):'-'}</strong> até <strong>${filtMax?fmtDateBR(filtMax):'-'}</strong> — ${filtRows.length} O.S. 58 ${mp?'<strong>(Mesma periodicidade ativa: corte no dia '+exec.diaAtualDoMes+')</strong>':''}</div>`;

  const html = intervaloBadge + `
    <div class="cards-grid">
      <div class="card"><div class="card-label">O.S. 58 — Mês Atual</div><div class="card-value">${fmtNum(exec.totalAtual)}</div><div class="card-sub">${fmtMonthYear(exec.refYear,exec.refMonth)} (até ${exec.diaAtualDoMes}/${exec.totalDiasMesCalendario})</div></div>
      <div class="card"><div class="card-label">Mês Anterior</div><div class="card-value">${fmtNum(exec.totalAnterior)}</div><div class="card-sub">${fmtMonthYear.apply(null, addMonthsYM(exec.refYear,exec.refMonth,-1))}${exec.mesmaPeriodicidadeAtiva?' (até dia '+exec.diaCorte+')':''}</div></div>
      <div class="card ${cardClassForVar(exec.variacao)}"><div class="card-label">Variação Mês × Mês</div><div class="card-value ${cardClassForVar(exec.variacao)}">${fmtPct(exec.variacao,1)}</div><div class="card-sub">${exec.mesmaPeriodicidadeAtiva?'mesma periodicidade (até dia '+exec.diaCorte+')':'mês anterior completo'}</div></div>
      <div class="card"><div class="card-label">Média Diária</div><div class="card-value">${fmtNum(exec.mediaDiaria,1)}</div><div class="card-sub">${exec.diasComDados} dia(s) útil(eis) com produção</div></div>
      <div class="card ${projMesAtual&&projMesAtual.projecaoMaior?'pos':projMesAtual&&projMesAtual.projecaoMaior===false?'neg':''}">
        <div class="card-label">📈 Projeção — Ritmo Atual</div>
        <div class="card-value ${projMesAtual&&projMesAtual.projecaoMaior?'pos':projMesAtual&&projMesAtual.projecaoMaior===false?'neg':''}">${projMesAtual?fmtNum(projMesAtual.projecao,0):'-'}</div>
        <div class="card-sub">base: média atual ${projMesAtual?fmtNum(projMesAtual.mediaBase,1):'-'} O.S./dia</div>
      </div>
      <div class="card">
        <div class="card-label">📊 Projeção — Base Mês Anterior</div>
        <div class="card-value">${projMesAnterior?fmtNum(projMesAnterior.projecao,0):'-'}</div>
        <div class="card-sub">base: ${projMesAnterior&&projMesAnterior.baseMeses.length?projMesAnterior.baseMeses[0]:'-'} — ${projMesAnterior?fmtNum(projMesAnterior.mediaBase,1):'-'} O.S./dia</div>
      </div>
      <div class="card ${cardClassForVar(exec.variacaoAnual)}"><div class="card-label">Variação Anual</div><div class="card-value ${cardClassForVar(exec.variacaoAnual)}">${fmtPct(exec.variacaoAnual,1)}</div><div class="card-sub">vs. ${fmtMonthYear(exec.refYear-1,exec.refMonth)}${exec.mesmaPeriodicidadeAtiva?' (até dia '+exec.diaCorte+')':''} (${fmtNum(exec.totalAnoAnterior)})</div></div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>Comparação — Modo ${Production.state.mode==='dia'?'Dia':Production.state.mode==='semana'?'Semana':'Mês'}</h3></div>
      <div class="grid-3">
        <div class="card"><div class="card-label">${escapeHtml(cmp.labelAtual)}</div><div class="card-value">${fmtNum(cmp.atual)}</div></div>
        <div class="card"><div class="card-label">${escapeHtml(cmp.labelAnterior)}</div><div class="card-value">${fmtNum(cmp.anterior)}</div></div>
        <div class="card ${cardClassForVar(cmp.variacao)}"><div class="card-label">Variação</div><div class="card-value ${cardClassForVar(cmp.variacao)}">${fmtPct(cmp.variacao,1)}</div></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h3>Evolução Mensal — O.S. 58</h3><span class="panel-note">Fonte: 8460 · DTFIMSEPARACAO</span></div>
        <div class="chart-wrap"><canvas id="chart-evo-mensal"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Mês Atual × Mês Anterior</h3></div>
        <div class="chart-wrap"><canvas id="chart-mes-mes"></canvas></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>Tabela de Comparação Mensal</h3></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Mês</th><th>O.S. 58</th><th>Mês Anterior</th><th>Diferença</th><th>Variação %</th><th>Média Diária</th></tr></thead>
        <tbody>
          ${evo.map(m=>`<tr>
            <td>${m.label}</td><td>${fmtNum(m.total)}</td><td>${m.prevTotal===null?'-':fmtNum(m.prevTotal)}</td>
            <td class="${m.diff>0?'cell-pos':m.diff<0?'cell-neg':'cell-neutral'}">${m.diff===null?'-':(m.diff>0?'+':'')+fmtNum(m.diff)}</td>
            <td>${variationTag(m.variacao)}</td><td>${fmtNum(m.mediaDiaria,1)}</td>
          </tr>`).join("")}
        </tbody>
      </table></div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-header">
          <h3>Comparativo Anual</h3>
          <div class="panel-actions">
            <select id="year-cmp-select-1"></select> <span class="small-muted">×</span> <select id="year-cmp-select-2"></select>
          </div>
        </div>
        <div class="table-wrap"><table class="data-table" id="year-cmp-table"></table></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Gráfico Ano × Ano</h3></div>
        <div class="chart-wrap"><canvas id="chart-ano-ano"></canvas></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>Acumulado do Ano (YTD)</h3></div>
      ${ytd ? `
      <div class="grid-3">
        <div class="card"><div class="card-label">${ytd.periodoAtual}</div><div class="card-value">${fmtNum(ytd.atual)}</div></div>
        <div class="card"><div class="card-label">${ytd.periodoAnterior}</div><div class="card-value">${fmtNum(ytd.anterior)}</div></div>
        <div class="card ${cardClassForVar(ytd.variacao)}"><div class="card-label">Diferença / Variação</div><div class="card-value ${cardClassForVar(ytd.variacao)}">${ytd.diff>0?'+':''}${fmtNum(ytd.diff)}</div><div class="card-sub">${variationTag(ytd.variacao)}</div></div>
      </div>` : `<div class="small-muted">Dados insuficientes para acumulado anual.</div>`}
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-header">
          <h3>Produção Diária</h3>
          <select id="prod-daily-mes-select" style="font-size:12px;padding:4px 8px;border:1px solid #dde3ea;border-radius:6px;">
            <option value="0" ${Production.state.dailyChartMes===0?'selected':''}>Mês Atual</option>
            <option value="1" ${Production.state.dailyChartMes!==0?'selected':''}>Mês Anterior (fechado)</option>
          </select>
        </div>
        ${daily.length ? `
        <div class="card" style="margin-bottom:10px;display:inline-flex;align-items:center;gap:14px;padding:10px 16px;border-left:4px solid var(--orange);">
          <div><div class="card-label">Média Diária</div><div style="font-size:22px;font-weight:800;color:var(--orange);">${fmtNum(daily[0]?daily[0].media:0,1)}</div></div>
          <div class="small-muted">O.S. 58 / dia</div>
        </div>` : ''}
        <div class="chart-wrap tall"><canvas id="chart-diario"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Produção Semanal</h3><span class="panel-note">Clique em uma semana para ver o detalhe dia a dia</span></div>
        <div class="table-wrap" style="max-height:420px;overflow-y:auto;"><table class="data-table" id="weekly-main-table">
          <thead><tr><th>Semana</th><th>O.S. 58</th><th>Semana Anterior</th><th>Diferença</th><th>Variação %</th></tr></thead>
          <tbody>
            ${weekly.map((w,i)=>`<tr class="clickable" data-wi="${i}" data-weekkey="${w.weekKey}" onclick="showWeekDrilldown(${w.weekKey},${w.anteriorWeekKey||'null'},'${escapeHtml(w.label)}',${w.anterior||'null'})">
              <td>📅 ${w.label}</td><td>${fmtNum(w.total)}</td><td>${w.anterior===null?'-':fmtNum(w.anterior)}</td>
              <td class="${w.diff>0?'cell-pos':w.diff<0?'cell-neg':'cell-neutral'}">${w.diff===null?'-':(w.diff>0?'+':'')+fmtNum(w.diff)}</td>
              <td>${variationTag(w.variacao)}</td></tr>`).join("")}
          </tbody>
        </table></div>

        <!-- Detalhe dia a dia (aparece ao clicar) -->
        <div id="week-drilldown" style="display:none;margin-top:16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span id="week-drilldown-title" style="font-size:13px;font-weight:700;color:var(--blue-dark);"></span>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('week-drilldown').style.display='none';document.getElementById('weekly-main-table').querySelectorAll('tr.selected-week').forEach(r=>r.classList.remove('selected-week'))">✕ Fechar</button>
          </div>
          <div id="week-drilldown-content"></div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Ranking de Repositores — O.S. 58</h3>
        <div class="panel-actions">
          <label class="small-muted" style="margin-right:6px;">Apenas Repositor (Cargo)?</label>
          <div class="toggle-group" id="prod-ranking-repositor-toggle">
            <button data-v="NAO" class="${!producaoOnlyRepositor?'active':''}">Não</button>
            <button data-v="SIM" class="${producaoOnlyRepositor?'active':''}">Sim</button>
          </div>
        </div>
      </div>
      ${producaoOnlyRepositor && !getRepositorCodeSet() ? `<div class="warn-box">A coluna CARGO não foi encontrada na aba QUADRO REP — este filtro não tem efeito até essa coluna existir no arquivo.</div>` : ``}
      <div id="ranking-section"></div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Projeção de Fechamento do Mês</h3>
        <div class="panel-actions">
          <label class="small-muted">Base:</label>
          <select id="proj-base-select">
            <option value="0" ${Production.state.projectionBase===0?'selected':''}>Mês Atual</option>
            <option value="1" ${Production.state.projectionBase===1?'selected':''}>Último mês</option>
            <option value="2" ${Production.state.projectionBase===2?'selected':''}>Últimos 2 meses</option>
            <option value="3" ${Production.state.projectionBase===3?'selected':''}>Últimos 3 meses</option>
          </select>
        </div>
      </div>
      <div id="proj-expanded-content"></div>
    </div>

  `;
  $("#prod-content").innerHTML = html;

  // renderizar ranking (precisa do DOM)
  renderRankingSection(rankingSelectedPeriod);

  $("#prod-ranking-repositor-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    producaoOnlyRepositor = b.dataset.v === "SIM";
    renderProducaoContent();
  });

  // charts
  Charts.make("chart-evo-mensal", {
    type:"line",
    data:{ labels: evo.map(m=>m.label), datasets:[{
      label:"O.S. 58", data: evo.map(m=>m.total), borderColor:Charts.colors.blue,
      backgroundColor:"rgba(47,111,206,0.12)", fill:true, tension:.3, pointRadius:3
    }]},
    options: Charts.baseOptions({
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(ctx)=>{
        const d = evo[ctx.dataIndex];
        return [`O.S. 58: ${fmtNum(d.total)}`, `Média diária: ${fmtNum(d.mediaDiaria,1)}`,
          d.diff!==null?`Diferença: ${d.diff>0?'+':''}${fmtNum(d.diff)}`:null,
          d.variacao!==null?`Variação: ${fmtPct(d.variacao,1)}`:null].filter(Boolean);
      }}}}
    })
  });

  // mês×mês respeitando mesma periodicidade
  const mesAtualLabel = mp
    ? `${fmtMonthYear(exec.refYear,exec.refMonth)} (até dia ${exec.diaAtualDoMes})`
    : fmtMonthYear(exec.refYear,exec.refMonth);
  const mesAntLabel = mp
    ? `${fmtMonthYear.apply(null, addMonthsYM(exec.refYear,exec.refMonth,-1))} (até dia ${exec.diaAtualDoMes})`
    : fmtMonthYear.apply(null, addMonthsYM(exec.refYear,exec.refMonth,-1));
  Charts.make("chart-mes-mes", {
    type:"bar",
    data:{ labels:[mesAntLabel, mesAtualLabel],
      datasets:[{ label:"O.S. 58", data:[exec.totalAnterior, exec.totalAtual],
        backgroundColor:[Charts.colors.gray, Charts.colors.blue], borderRadius:6 }] },
    options: Charts.baseOptions({ plugins:{ legend:{display:false} } })
  });

  Charts.make("chart-diario", {
    type:"bar",
    data:{ labels: daily.map(d=>fmtDateBR(d.date)), datasets:[
      { type:"bar", label:"O.S. 58", data: daily.map(d=>d.total), backgroundColor:Charts.colors.blueLight, borderRadius:4 },
      { type:"line", label:"Média", data: daily.map(d=>d.media), borderColor:Charts.colors.orange, borderWidth:2, pointRadius:0, tension:0, datalabels:{ display:false } }
    ]},
    options: Charts.baseOptions({ plugins:{ tooltip:{ callbacks:{ label:(ctx)=>{
      const d = daily[ctx.dataIndex];
      if(ctx.dataset.label==="Média") return `Média: ${fmtNum(d.media,1)}`;
      return `Quantidade: ${fmtNum(d.total)} (dif. média: ${fmtNum(d.total-d.media,1)})`;
    }}}}})
  });

  const dailyMesSel = $("#prod-daily-mes-select");
  if(dailyMesSel) dailyMesSel.addEventListener("change", e=>{
    Production.state.dailyChartMes = Number(e.target.value);
    renderProducaoContent();
  });

  // gráfico anual com barra do mês atual destacada
  const sel1 = $("#year-cmp-select-1"), sel2 = $("#year-cmp-select-2");
  const allYears = yearCmp.allYears;
  sel1.innerHTML = allYears.map(y=>`<option value="${y}" ${y===yearCmp.years[0]?'selected':''}>${y}</option>`).join("");
  sel2.innerHTML = allYears.map(y=>`<option value="${y}" ${y===yearCmp.years[1]?'selected':''}>${y}</option>`).join("");
  function renderYearTable(){
    const y1 = Number(sel1.value), y2 = Number(sel2.value);
    const data = Production.yearComparison([y1,y2]);
    const table = $("#year-cmp-table");
    table.innerHTML = `<thead><tr><th>Mês</th><th>${y1}</th><th>${y2}</th><th>Diferença</th><th>Variação %</th></tr></thead>
      <tbody>${data.table.map(r=>{
        const v1=r.values[y1]||0, v2=r.values[y2]||0, diff=v2-v1, varr=pctVariation(v2,v1);
        return `<tr><td>${r.label}</td><td>${fmtNum(v1)}</td><td>${fmtNum(v2)}</td>
          <td class="${diff>0?'cell-pos':diff<0?'cell-neg':'cell-neutral'}">${diff>0?'+':''}${fmtNum(diff)}</td><td>${variationTag(varr)}</td></tr>`;
      }).join("")}</tbody>`;
    // destaque para o mês atual
    const mesAtualIdx = exec.refMonth;
    const bgY2 = data.table.map((_,i)=> i===mesAtualIdx ? Charts.colors.orange : Charts.colors.blue);
    Charts.make("chart-ano-ano", {
      type:"bar",
      data:{ labels: data.table.map(r=>r.label), datasets:[
        { label:String(y1), data: data.table.map(r=>r.values[y1]||0), backgroundColor:Charts.colors.gray, borderRadius:4 },
        { label:String(y2)+" (atual)", data: data.table.map(r=>r.values[y2]||0), backgroundColor:bgY2, borderRadius:4 }
      ]},
      options: Charts.baseOptions({ plugins:{ tooltip:{ callbacks:{ footer:(items)=>{ if(items[0].dataIndex===mesAtualIdx) return 'Mês atual (destaque)'; }}}} })
    });
  }
  sel1.addEventListener("change", renderYearTable);
  sel2.addEventListener("change", renderYearTable);
  renderYearTable();

  const pbase = $("#proj-base-select");
  if(pbase) pbase.addEventListener("change", e=>{ Production.state.projectionBase = Number(e.target.value); renderProjecaoExpandida(Production.projection()); });
  renderProjecaoExpandida(proj);

  // Semana atual sempre expandida por padrão (sem precisar clicar)
  const hojeWk = weekOfYearMonday(Production.maxDataDate() || new Date());
  const hojeWeekKey = hojeWk.year*100+hojeWk.week;
  const semanaAtual = weekly.find(w=>w.weekKey===hojeWeekKey);
  if(semanaAtual){
    showWeekDrilldown(semanaAtual.weekKey, semanaAtual.anteriorWeekKey, semanaAtual.label, semanaAtual.anterior);
  }
}

function renderProjecaoExpandida(proj){
  const el = document.getElementById("proj-expanded-content");
  if(!el) return;
  if(!proj){ el.innerHTML = `<div class="small-muted">Dados insuficientes para projeção.</div>`; return; }

  // filtro "apenas Repositor" — afeta SOMENTE a tabela de Projeção por Funcionário,
  // os cards e gráficos gerais (topo do painel) continuam com o time completo.
  let empProjFiltrado = proj.empProj;
  if(producaoOnlyRepositor){
    const repositorSet = getRepositorCodeSet();
    if(repositorSet) empProjFiltrado = proj.empProj.filter(e=>repositorSet.has(e.codKey));
  }

  const corProj = proj.projecaoMaior ? Charts.colors.green : Charts.colors.red;
  const tagProj = proj.projecaoMaior
    ? `<span class="tag-pos">▲ Ritmo atual acima da base (${fmtNum(proj.mediaDiariaAtual,1)} vs ${fmtNum(proj.mediaBase,1)} O.S./dia)</span>`
    : `<span class="tag-neg">▼ Ritmo atual abaixo da base (${fmtNum(proj.mediaDiariaAtual,1)} vs ${fmtNum(proj.mediaBase,1)} O.S./dia)</span>`;

  el.innerHTML = `
    ${proj.avisoHistoricoInsuficiente ? `<div class="warn-box">${escapeHtml(proj.avisoHistoricoInsuficiente)}</div>` : ''}
    <div class="cards-grid" style="margin-bottom:14px;">
      <div class="card"><div class="card-label">Mês de referência</div><div class="card-value">${proj.mesAtual}</div></div>
      <div class="card"><div class="card-label">Base utilizada</div><div class="card-value" style="font-size:15px;">${proj.baseMeses.join(", ")||'Mês atual'}</div><div class="card-sub">${proj.mesesSolicitados===0 ? 'Média dos dias úteis já passados neste mês' : `${proj.mesesDisponiveisBase}/${proj.mesesSolicitados} mese(s) disponíveis`}</div></div>
      <div class="card"><div class="card-label">Média diária base</div><div class="card-value">${fmtNum(proj.mediaBase,1)}</div></div>
      <div class="card"><div class="card-label">Média diária atual</div><div class="card-value">${fmtNum(proj.mediaDiariaAtual,1)}</div></div>
      <div class="card ${proj.projecaoMaior?'pos':'neg'}">
        <div class="card-label">Projeção de fechamento ${tagProj}</div>
        <div class="card-value ${proj.projecaoMaior?'pos':'neg'}">${fmtNum(proj.projecao,0)}</div>
        <div class="card-sub">${proj.totalDiasMes} dias úteis × ${fmtNum(proj.mediaBase,1)} O.S./dia</div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--blue-dark);margin-bottom:8px;">Evolução Real + Projeção (${proj.mesAtual})</div>
        <div class="chart-wrap tall"><canvas id="chart-proj-dia"></canvas></div>
      </div>
      <div>
        <div style="font-size:13px;font-weight:700;color:var(--blue-dark);margin-bottom:8px;">Ano Atual — Mês a Mês com Projeção</div>
        <div class="chart-wrap tall"><canvas id="chart-proj-ano-mensal"></canvas></div>
      </div>
    </div>

    <div style="margin-top:18px;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:700;color:var(--blue-dark);">Projeção por Funcionário — ${proj.mesAtual}</div>
        ${producaoOnlyRepositor ? `<span class="tag-neutral">somente cargo Repositor</span>` : ``}
      </div>
      ${(()=>{
        // Calcula meta/corte do estado de acompanhamento individual (compartilha os mesmos parâmetros)
        const meta = individualState.meta;
        const corte = individualState.linhaDeCorteMes;
        // Enriquecer cada linha com dados de acompanhamento individual
        const empEnriquecido = empProjFiltrado.map(e=>{
          const ind = computeIndividual(e.codKey, meta);
          return ind ? { ...e, ...ind } : { ...e, mediaNecessaria:null, projetadoRitmoAtual:e.projecaoFechamento, osAtual:e.totalAtual, mediaDiaMesAtual:e.mediaDiariaEmp, diasRestantes:'?' };
        });
        const total = empEnriquecido.length;
        const counts = empEnriquecido.reduce((acc,e)=>{
          const proj = e.projecaoFechamento||e.projetadoRitmoAtual;
          if(proj>=meta) acc.meta++; else if(proj>=corte) acc.corte++; else acc.abaixo++;
          return acc;
        },{abaixo:0,corte:0,meta:0});
        const pill = (proj) => {
          const c = proj>=meta?'#1a9c62':proj>=corte?'#e08a1f':'#d64545';
          const t = proj>=meta?'Meta ✅':proj>=corte?'Corte ⚠️':'Abaixo ❌';
          return `<span style="background:${c}22;color:${c};font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;white-space:nowrap;">${t}</span>`;
        };
        const pct = (n) => total>0?fmtNum(n/total*100,1)+'%':'0%';
        // ordena: menor projeção primeiro (quem mais precisa de atenção no topo)
        const sorted = [...empEnriquecido].sort((a,b)=>(a.projecaoFechamento||a.projetadoRitmoAtual)-(b.projecaoFechamento||b.projetadoRitmoAtual));
        return `
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
            <div class="card neg" style="flex:1;min-width:130px;"><div class="card-label">❌ Abaixo do Corte</div><div class="card-value neg">${counts.abaixo}</div><div class="card-sub">${pct(counts.abaixo)} · proj. &lt; ${fmtNum(corte)}</div></div>
            <div class="card warn" style="flex:1;min-width:130px;"><div class="card-label">⚠️ Corte, abaixo da Meta</div><div class="card-value warn">${counts.corte}</div><div class="card-sub">${pct(counts.corte)} · ${fmtNum(corte)}–${fmtNum(meta)}</div></div>
            <div class="card pos" style="flex:1;min-width:130px;"><div class="card-label">✅ Atingindo a Meta</div><div class="card-value pos">${counts.meta}</div><div class="card-sub">${pct(counts.meta)} · proj. ≥ ${fmtNum(meta)}</div></div>
            <div class="card" style="flex:1;min-width:130px;"><div class="card-label">👥 Total</div><div class="card-value">${total}</div><div class="card-sub">Meta: ${fmtNum(meta)} · Corte: ${fmtNum(corte)}</div></div>
          </div>
          <div class="table-wrap"><table class="data-table">
            <thead><tr>
              <th>#</th><th>Funcionário</th>
              <th>O.S. até dia ${proj.ultimoDia}</th>
              <th>Média/Dia</th><th>Projeção</th>
              <th>Dias Rest.</th>
              <th>⚡ Média Nec. P.Meta</th>
              <th>Status</th>
            </tr></thead>
            <tbody>
              ${sorted.map((e,i)=>{
                const projVal = e.projecaoFechamento||e.projetadoRitmoAtual;
                const necColor = e.mediaNecessaria===null?'#7a8798':e.mediaNecessaria<=meta/e.diasUteisMes*1.05?'#1a9c62':e.mediaNecessaria<=e.mediaHistorica*1.5?'#e08a1f':'#d64545';
                return `<tr class="clickable" onclick="selectIndividualFromTable('${escapeHtml(e.codKey)}')">
                  <td style="color:#7a8798;">${i+1}</td>
                  <td>${escapeHtml(e.nome)}</td>
                  <td>${fmtNum(e.totalAtual||e.osAtual)}</td>
                  <td>${fmtNum(e.mediaDiariaEmp||e.mediaDiaMesAtual,1)}</td>
                  <td style="font-weight:700;">${fmtNum(projVal)}</td>
                  <td style="color:${String(e.diasRestantes)<=3?'#d64545':'#123a6b'};">${e.diasRestantes}</td>
                  <td style="font-weight:800;color:${necColor};">${e.mediaNecessaria!==null?fmtNum(e.mediaNecessaria,1):'—'}</td>
                  <td>${pill(projVal)}</td>
                </tr>`;
              }).join("") || '<tr><td colspan="8" class="small-muted">Sem dados no mês atual.</td></tr>'}
            </tbody>
          </table></div>`;
      })()}
    </div>
  `;

  // --- Gráfico 1: real dia a dia + linha de projeção tracejada ---
  const dr = proj.diasReais;
  const diasLabels = dr.map(d=>`Dia ${d.dia}`);
  // pontos reais (null nos dias sem dado)
  const realData = dr.map(d=>d.acumReal);
  // projeção completa para todos os dias
  const projData = dr.map(d=>d.acumProj);

  Charts.make("chart-proj-dia", {
    type:"line",
    data:{ labels: diasLabels, datasets:[
      {
        label:"Real acumulado", data: realData,
        borderColor:Charts.colors.blue, backgroundColor:"rgba(47,111,206,0.1)",
        fill:true, tension:.3, pointRadius:3, spanGaps:false
      },
      {
        label:`Projeção (${proj.mesesSolicitados === 1 ? '1 mês' : proj.mesesSolicitados+' meses'})`,
        data: projData,
        borderColor: corProj, borderDash:[6,4], borderWidth:2.5,
        pointRadius:0, fill:false, tension:0
      }
    ]},
    options: Charts.baseOptions({
      plugins:{ legend:{ labels:{font:{size:11}} }, tooltip:{ callbacks:{ label:(ctx)=>{
        if(ctx.dataset.label.startsWith("Real")) return `Real: ${fmtNum(ctx.parsed.y)} O.S.`;
        return `Projeção dia ${dr[ctx.dataIndex].dia}: ${fmtNum(ctx.parsed.y)} O.S.`;
      }}}},
      scales:{ x:{grid:{display:false}, ticks:{color:"#7a8798",font:{size:10},maxTicksLimit:15}}, y:{grid:{color:"#eaeef3"}, beginAtZero:true} }
    })
  });

  // --- Gráfico 2: meses do ano atual com barra do mês atual destacada + projeção ---
  const rows = Production.getBaseRows();
  const anoAtual = Production.maxDataDate().getFullYear();
  const dadosMensaisAno = MESES_PT.map((label,m)=>{
    const total = rows.filter(r=>r.dtinicio.getFullYear()===anoAtual && r.dtinicio.getMonth()===m).length;
    return { label, m, total };
  });
  const mesAtualIdx = Production.maxDataDate().getMonth();
  const bgColors = dadosMensaisAno.map((_,m)=> m===mesAtualIdx ? Charts.colors.orange : Charts.colors.blue);
  const projecaoData = dadosMensaisAno.map((_,m)=> m===mesAtualIdx ? proj.projecao : null);

  Charts.make("chart-proj-ano-mensal", {
    type:"bar",
    data:{ labels: dadosMensaisAno.map(d=>d.label+"/"+anoAtual), datasets:[
      { label:"O.S. 58", data: dadosMensaisAno.map(d=>d.total||null), backgroundColor:bgColors, borderRadius:4 },
      { type:"line", label:"Projeção fechamento", data: projecaoData, borderColor:corProj, backgroundColor:"transparent", borderWidth:2.5, borderDash:[5,4], pointRadius:5, pointBackgroundColor:corProj }
    ]},
    options: Charts.baseOptions({
      plugins:{ legend:{ labels:{font:{size:11}} }, tooltip:{ callbacks:{ footer:(items)=>{ if(items[0].dataIndex===mesAtualIdx) return '★ Mês atual — barra destacada'; }}}}
    })
  });
}

function getRankingRows(periodoKey){
  const allRows = Production.getBaseRows(); // respeita quadro atual e funcionário selecionado
  const registry = window.APP_STATE.nameRegistry;
  const maxDate = Production.maxDataDate();
  if(!maxDate) return [];

  let startDate, endDate = dateOnly(maxDate);
  if(periodoKey === "mes-atual"){
    startDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  } else if(periodoKey === "mes-anterior-e-atual"){
    startDate = addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), -1);
  } else { // ultimos-3
    startDate = addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), -2);
  }

  let filtered = allRows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startDate && d<=endDate; });

  if(producaoOnlyRepositor){
    const repositorSet = getRepositorCodeSet();
    if(repositorSet) filtered = filtered.filter(r=>repositorSet.has(r.codKey));
  }

  // --- O.S. 58 Mês Anterior (mesmo período): dia 1 até o mesmo dia-do-mês de hoje,
  // só que no mês anterior — ex.: hoje é dia 14, compara com dia 1-14 do mês passado.
  // Independe do periodoKey selecionado acima (é sempre essa mesma janela fixa).
  const diaAtual = maxDate.getDate();
  const mesAntAno = maxDate.getMonth()-1<0 ? maxDate.getFullYear()-1 : maxDate.getFullYear();
  const mesAntMes = (maxDate.getMonth()-1+12)%12;
  const mesAntIni = dateOnly(new Date(mesAntAno, mesAntMes, 1));
  const ultimoDiaMesAnt = new Date(mesAntAno, mesAntMes+1, 0).getDate();
  const mesAntFim = dateOnly(new Date(mesAntAno, mesAntMes, Math.min(diaAtual, ultimoDiaMesAnt)));
  let rowsMesAnt = allRows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=mesAntIni && d<=mesAntFim; });
  if(producaoOnlyRepositor){
    const repositorSet = getRepositorCodeSet();
    if(repositorSet) rowsMesAnt = rowsMesAnt.filter(r=>repositorSet.has(r.codKey));
  }
  const mapAnt = new Map();
  rowsMesAnt.forEach(r=>{ mapAnt.set(r.codKey, (mapAnt.get(r.codKey)||0)+1); });

  const map = new Map();
  filtered.forEach(r=>{
    if(!map.has(r.codKey)) map.set(r.codKey, { codKey:r.codKey, nome: registry.get(r.codKey)||r.nome, total:0 });
    map.get(r.codKey).total++;
  });
  return Array.from(map.values()).map(e=>({...e, osMesAnterior: mapAnt.get(e.codKey)||0})).sort((a,b)=>b.total-a.total);
}

function renderRankingSection(periodoKey){
  const el = document.getElementById("ranking-section");
  if(!el) return;
  const rows = getRankingRows(periodoKey);
  const top5 = rows.slice(0,5);
  const bot5 = rows.slice(-5).reverse();

  const periodOptions = [
    { value:"mes-atual", label:"Mês atual" },
    { value:"mes-anterior-e-atual", label:"Mês anterior e atual" },
    { value:"ultimos-3", label:"Últimos 3 meses" }
  ];
  const selHtml = (id) => `<select id="${id}" class="ranking-period-sel" style="border:1px solid var(--gray-300);border-radius:6px;padding:5px 9px;font-size:12px;">
    ${periodOptions.map(o=>`<option value="${o.value}" ${o.value===periodoKey?'selected':''}>${o.label}</option>`).join("")}
  </select>`;

  const medalha = (i) => i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}º`;

  el.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <span class="small-muted">Período:</span>
        ${selHtml("ranking-period-main")}
      </div>
      <div class="grid-2">
        <!-- MELHORES -->
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--green);margin-bottom:10px;">📈 Destaques em Produtividade</div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            ${top5.map((r,i)=>`<div class="card pos" style="min-width:140px;flex:1;">
              <div class="card-label">${medalha(i)}</div>
              <div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:4px;">${escapeHtml(r.nome.split(" ")[0])} ${escapeHtml(r.nome.split(" ").slice(-1)[0])}</div>
              <div class="card-value pos" style="font-size:20px;">${fmtNum(r.total)}</div>
              <div class="card-sub">O.S. 58</div>
            </div>`).join("") || '<div class="small-muted">Sem dados.</div>'}
          </div>
          <div class="table-wrap" style="max-height:260px;overflow-y:auto;">
            <table class="data-table">
              <thead><tr><th>#</th><th>Repositor</th><th>O.S. 58</th><th>O.S. 58 Mês Anterior</th></tr></thead>
              <tbody>
                ${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(r.nome)}</td><td class="cell-pos">${fmtNum(r.total)}</td><td class="small-muted">${fmtNum(r.osMesAnterior)}</td></tr>`).join("") || '<tr><td colspan="4" class="small-muted">—</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
        <!-- PIORES -->
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--orange);margin-bottom:10px;">🎯 Oportunidades de Desenvolvimento</div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            ${bot5.map((r,i)=>`<div class="card neg" style="min-width:140px;flex:1;">
              <div class="card-label">Atenção</div>
              <div style="font-size:13px;font-weight:700;color:var(--ink);margin-top:4px;">${escapeHtml(r.nome.split(" ")[0])} ${escapeHtml(r.nome.split(" ").slice(-1)[0])}</div>
              <div class="card-value neg" style="font-size:20px;">${fmtNum(r.total)}</div>
              <div class="card-sub">O.S. 58</div>
            </div>`).join("") || '<div class="small-muted">Sem dados.</div>'}
          </div>
          <div class="table-wrap" style="max-height:260px;overflow-y:auto;">
            <table class="data-table">
              <thead><tr><th>#</th><th>Repositor</th><th>O.S. 58</th><th>O.S. 58 Mês Anterior</th></tr></thead>
              <tbody>
                ${[...rows].reverse().map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(r.nome)}</td><td class="cell-neg">${fmtNum(r.total)}</td><td class="small-muted">${fmtNum(r.osMesAnterior)}</td></tr>`).join("") || '<tr><td colspan="4" class="small-muted">—</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById("ranking-period-main").addEventListener("change", e=>{
    rankingSelectedPeriod = e.target.value;
    renderRankingSection(e.target.value);
  });
}

function showWeekDrilldown(weekKey, anteriorWeekKey, labelSemana, totalAnterior){
  // destaca a linha clicada — usa data-weekkey (comparação exata, sem risco de substring casar com outra semana)
  document.querySelectorAll("#weekly-main-table tr.selected-week").forEach(r=>r.classList.remove("selected-week"));
  document.querySelectorAll("#weekly-main-table tbody tr[data-weekkey]").forEach(r=>{
    if(String(r.dataset.weekkey) === String(weekKey)) r.classList.add("selected-week");
  });

  const breakdown = Production.weeklyDayBreakdown(weekKey, anteriorWeekKey);

  const drillEl = document.getElementById("week-drilldown");
  const titleEl = document.getElementById("week-drilldown-title");
  const contentEl = document.getElementById("week-drilldown-content");

  titleEl.textContent = `Detalhe dia a dia — ${labelSemana}`;
  drillEl.style.display = "block";

  // "Total da semana" = soma do que já aconteceu de fato (dias ainda não ocorridos contam 0 aqui)
  const totalCur  = breakdown.reduce((s,d)=>s+(d.totalCur||0), 0);
  const totalPrev = anteriorWeekKey ? breakdown.reduce((s,d)=>s+(d.totalPrev||0), 0) : null;
  const diffTotal = totalPrev !== null ? totalCur - totalPrev : null;

  // "Projeção da semana" = real (dias que já ocorreram) + projetado (dias que ainda não ocorreram)
  const temDiaFuturo = breakdown.some(d=>!d.occurred);
  const totalProjetadoSemana = breakdown.reduce((s,d)=> s + (d.occurred ? (d.totalCur||0) : (d.projetado||0)), 0);

  contentEl.innerHTML = `
    <div style="display:flex;gap:12px;flex-wrap:nowrap;margin-bottom:12px;">
      <div class="card" style="min-width:0;flex:1 1 0;">
        <div class="card-label">Total da Semana (realizado)</div>
        <div class="card-value">${fmtNum(totalCur)}</div>
      </div>
      ${totalPrev !== null ? `
      <div class="card" style="min-width:0;flex:1 1 0;">
        <div class="card-label">Semana Anterior</div>
        <div class="card-value">${fmtNum(totalPrev)}</div>
      </div>
      <div class="card ${diffTotal>0?'pos':diffTotal<0?'neg':''}" style="min-width:0;flex:1 1 0;">
        <div class="card-label">Diferença</div>
        <div class="card-value ${diffTotal>0?'pos':diffTotal<0?'neg':''}">${diffTotal>0?'+':''}${fmtNum(diffTotal)}</div>
        <div class="card-sub">${variationTag(pctVariation(totalCur, totalPrev))}</div>
      </div>` : ''}
      <div class="card warn" style="min-width:0;flex:1 1 0;">
        <div class="card-label">Projeção da Semana</div>
        <div class="card-value warn">${fmtNum(totalProjetadoSemana)}</div>
        <div class="card-sub">${temDiaFuturo ? 'realizado + projetado p/ dias que faltam' : 'semana já totalmente realizada'}</div>
      </div>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Dia</th>
            <th>Data</th>
            <th>O.S. 58 (feito)</th>
            <th>Projetado</th>
            ${anteriorWeekKey ? `<th>Data (ant.)</th><th>O.S. 58 (ant.)</th><th>Diferença</th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${breakdown.map(d=>{
            const valorParaDiff = d.occurred ? d.totalCur : d.projetado;
            const diff = (d.totalPrev !== null && valorParaDiff !== null) ? valorParaDiff - d.totalPrev : null;
            return `<tr${!d.occurred?' style="background:var(--blue-light);"':''}>
              <td><strong>${d.diaNome}</strong></td>
              <td>${fmtDateBR(d.dataCur)}</td>
              <td>${d.occurred ? `<strong>${fmtNum(d.totalCur)}</strong>` : '<span class="small-muted">— (dia não ocorreu)</span>'}</td>
              <td>${!d.occurred ? (d.projetado!==null ? `<span class="tag-warn">≈ ${fmtNum(d.projetado,1)}</span>` : '<span class="small-muted">sem histórico</span>') : '<span class="small-muted">—</span>'}</td>
              ${anteriorWeekKey ? `
                <td class="small-muted">${d.dataPrev ? fmtDateBR(d.dataPrev) : '-'}</td>
                <td>${d.totalPrev !== null ? fmtNum(d.totalPrev) : '-'}</td>
                <td class="${diff>0?'cell-pos':diff<0?'cell-neg':'cell-neutral'}">${diff===null?'-':(diff>0?'+':'')+fmtNum(diff,d.occurred?0:1)}</td>
              ` : ''}
            </tr>`;
          }).join("")}
          <tr style="background:var(--gray-50);font-weight:700;">
            <td colspan="2">Total</td>
            <td>${fmtNum(totalCur)}</td>
            <td>${temDiaFuturo ? `<span class="tag-warn">≈ ${fmtNum(totalProjetadoSemana - totalCur,1)}</span>` : '—'}</td>
            ${anteriorWeekKey ? `<td></td><td>${fmtNum(totalPrev)}</td><td class="${diffTotal>0?'cell-pos':diffTotal<0?'cell-neg':'cell-neutral'}">${diffTotal>0?'+':''}${fmtNum(diffTotal)}</td>` : ''}
          </tr>
        </tbody>
      </table>
    </div>
    <p class="panel-note" style="margin-top:8px;">📘 A coluna <strong>Projetado</strong> só é preenchida para dias que ainda não ocorreram — calculada pela média das demais ocorrências desse mesmo dia da semana no mês. A coluna <strong>O.S. 58 (feito)</strong> só é preenchida quando o dia realmente passa.</p>
  `;

  // scroll suave até o detalhe
  drillEl.scrollIntoView({ behavior:"smooth", block:"nearest" });
}

function addMonthsYM(y,m,n){
  const d = addMonths(new Date(y,m,1), n);
  return [d.getFullYear(), d.getMonth()];
}

/* ---------------------------------------------------------------------- */
/* RENDER: Projeção                                                        */
/* ---------------------------------------------------------------------- */
function renderProjecao(){
  const pane = $("#pane-projecao");
  const st = Projection.state;

  pane.innerHTML = `
    <div class="toolbar">
      <div class="filter-group">
        <label>Data Inicial</label>
        <input type="date" id="proj-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}">
      </div>
      <div class="filter-group">
        <label>Data Final</label>
        <input type="date" id="proj-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}">
      </div>
      <div class="spacer"></div>
      <button class="btn btn-outline btn-sm" id="proj-clear">Limpar filtros</button>
    </div>
    <div id="proj-empty-msg"></div>
    <div id="proj-content"></div>
  `;
  $("#proj-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderProjecao(); });
  $("#proj-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderProjecao(); });
  $("#proj-clear").addEventListener("click", ()=>{ Projection.state = { dataInicial:null, dataFinal:null }; renderProjecao(); });

  const rows = Projection.getRows();
  if(!rows.length){
    $("#proj-empty-msg").innerHTML = `<div class="warn-box">Nenhum registro encontrado na sheet 8271 para os filtros selecionados.</div>`;
    return;
  }

  const c61 = Projection.cards61();
  const ruas61 = Projection.ruas61();
  const c58 = Projection.cards58();
  const os58Rua = Projection.os58PorRua();

  // badge de intervalo
  const allDates = rows.map(r=>r.data).filter(Boolean);
  const minD = allDates.length ? new Date(Math.min(...allDates.map(d=>d.getTime()))) : null;
  const maxD = allDates.length ? new Date(Math.max(...allDates.map(d=>d.getTime()))) : null;
  const intervaloBadge = minD && maxD
    ? `<div class="hint-box" style="margin-bottom:14px;">📅 Exibindo dados de <strong>${fmtDateBR(minD)}</strong> até <strong>${fmtDateBR(maxD)}</strong> — ${rows.length} registro(s) na 8271</div>`
    : ``;

  const maxCount = Math.max(1, ...ruas61.map(r=>r.count));
  function heatColor(v){
    if(v===0) return "#dde3ea";
    const ratio = v/maxCount;
    // interpolate from light yellow to deep red
    const r = 214 + Math.round((255-214)*(1-ratio)*0); // keep simple
    // simple 3-stop scale: low -> orange, high -> red
    const stops = [
      {p:0.0, c:[240,201,110]},
      {p:0.5, c:[224,138,31]},
      {p:1.0, c:[214,69,69]}
    ];
    let c0=stops[0].c,c1=stops[1].c,p0=0,p1=.5;
    if(ratio>0.5){ c0=stops[1].c;c1=stops[2].c;p0=.5;p1=1; }
    const t = (ratio-p0)/(p1-p0||1);
    const col = c0.map((v0,i)=> Math.round(v0 + (c1[i]-v0)*t));
    return `rgb(${col[0]},${col[1]},${col[2]})`;
  }

  $("#proj-content").innerHTML = intervaloBadge + `
    <div class="panel">
      <div class="panel-header"><h3>TIPOOS 61 — Necessidade por Rua</h3><span class="panel-note">Fonte: 8271</span></div>
      <div class="cards-grid">
        <div class="card"><div class="card-label">Total de 61</div><div class="card-value">${fmtNum(c61.total)}</div></div>
        <div class="card"><div class="card-label">Ruas com 61</div><div class="card-value">${fmtNum(c61.ruasCom61)}</div><div class="card-sub">de ${fmtNum(ruas61.length)} ruas monitoradas</div></div>
        <div class="card"><div class="card-label">Média de 61 por Rua</div><div class="card-value">${fmtNum(c61.mediaPorRua,1)}</div></div>
        <div class="card warn"><div class="card-label">Maior Demanda</div><div class="card-value warn">${c61.maiorDemanda?('Rua '+c61.maiorDemanda.rua):'-'}</div><div class="card-sub">${c61.maiorDemanda?fmtNum(c61.maiorDemanda.count)+' registros':''}</div></div>
      </div>
      <div class="panel-header"><h3 style="font-size:13px;">Mapa de Calor — Ruas</h3></div>
      <div class="heatmap-grid">
        ${ruas61.map(r=>`<div class="heat-cell" style="background:${heatColor(r.count)};" title="Rua ${r.rua}: ${r.count} registros de TIPOOS 61">
          <span class="heat-rua">Rua ${r.rua}</span><span class="heat-val">${r.count}</span>
        </div>`).join("")}
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>TIPOOS 58 — Situação de O.S.</h3></div>
      <div class="cards-grid">
        <div class="card warn"><div class="card-label">58 Pendentes há 2+ dias</div><div class="card-value warn">${fmtNum(c58.doisOuMaisDias)}</div><div class="card-sub">OS cujo 1º registro é anterior a ${c58.ontem?fmtDateBR(c58.ontem):'-'} (não finalizadas na 8460)</div></div>
        <div class="card"><div class="card-label">58 do dia anterior</div><div class="card-value">${fmtNum(c58.doDiaAnterior)}</div><div class="card-sub">${c58.ontem?fmtDateBR(c58.ontem):'-'}</div></div>
        <div class="card"><div class="card-label">58 para hoje</div><div class="card-value">${fmtNum(c58.doDiaHoje)}</div><div class="card-sub">${c58.hoje?fmtDateBR(c58.hoje):'-'}</div></div>
        <div class="card"><div class="card-label">Total de Registros 58</div><div class="card-value">${fmtNum(c58.total)}</div></div>
      </div>
      <div class="chart-wrap"><canvas id="chart-58-rua"></canvas></div>
    </div>
  `;

  Charts.make("chart-58-rua", {
    type:"bar",
    data:{ labels: os58Rua.map(r=>"Rua "+r.rua), datasets:[{ label:"O.S. 58", data: os58Rua.map(r=>r.count), backgroundColor:Charts.colors.blue, borderRadius:4 }] },
    options: Charts.baseOptions({ plugins:{ legend:{display:false} } })
  });
}

/* ---------------------------------------------------------------------- */
/* Ranking de Repositores (Gestão > Feedback) — seleção p/ gerar documento */
/* ---------------------------------------------------------------------- */
let selectedFeedbackEmployees = new Set(); // codKeys selecionados na tabela de ranking (seleção múltipla)

let feedbackOnlyQuadroAtual = true; // filtro "apenas quadro atual" no ranking de feedback — inicia SIM
let feedbackOnlyRepositor = true; // filtro "apenas Cargo=REPOSITOR" no ranking de feedback — inicia SIM

function getFeedbackRankingData(){
  const processed = window.APP_STATE.processed;
  const currentTeam = window.APP_STATE.currentTeam;
  const registry = window.APP_STATE.nameRegistry;
  const maxDate = Production.maxDataDate();
  // Qualidade % vem da Auditoria online (Gestão > Auditoria, mesma planilha Google
  // Sheets), sempre nos últimos 3 meses (mesma janela usada em "O.S. Últimos 3 Meses"
  // abaixo) — independente de qualquer filtro que esteja ativo na tela de Auditoria.
  const qIni = maxDate ? addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), -2) : null;
  const qFim = maxDate ? dateOnly(maxDate) : null;
  const auditByEmp = (qIni && qFim) ? AuditOnline.qualidadePorRepositorNoIntervalo(qIni, qFim) : new Map();
  // qualidade mês a mês (3 últimos meses até a data máxima dos dados) + auditoria de retornos (3m)
  const mesesQ = maxDate ? [-2,-1,0].map(k=>{
    const ini = addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), k);
    const fim = k===0 ? dateOnly(maxDate) : new Date(ini.getFullYear(), ini.getMonth()+1, 0);
    return { ini, fim, rot: MESES_CAP[ini.getMonth()]+"/"+String(ini.getFullYear()).slice(2), mapa: AuditOnline.qualidadePorRepositorNoIntervalo(ini, fim) };
  }) : [];
  const retornoByEmp = (qIni && qFim && window.RetornoOnline) ? RetornoOnline.porRepositor(qIni, qFim) : new Map();
  const rows58 = processed.p8460.filter(r=>r.tipoos===58);

  // base de funcionários: quadro atual ou todo o histórico, conforme o toggle
  let baseMembers;
  if(feedbackOnlyQuadroAtual){
    baseMembers = currentTeam.members;
  } else {
    const codes = uniq(rows58.map(r=>r.codKey));
    baseMembers = codes.map(c=>{
      const inTeam = currentTeam.members.find(m=>m.codKey===c);
      return inTeam || { codKey:c, codigo:null, nome: registry.get(c)||c, cargo:null };
    });
  }
  // filtro "apenas Repositor" — só tem efeito se a coluna CARGO existir no arquivo
  if(feedbackOnlyRepositor && currentTeam.cargoDisponivel){
    baseMembers = baseMembers.filter(m=> m.cargo === "REPOSITOR");
  }

  let start3m = null, startWeek = null, startMonth = null, dayRef = null;
  if(maxDate){
    start3m = addMonths(new Date(maxDate.getFullYear(), maxDate.getMonth(), 1), -2);
    startWeek = startOfWeekMonday(maxDate);
    startMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    dayRef = dateOnly(maxDate);
  }

  return baseMembers.map(m=>{
    const empRows = rows58.filter(r=>r.codKey===m.codKey);
    const os3m = (start3m && maxDate) ? empRows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=start3m && d<=dateOnly(maxDate); }).length : 0;
    const osUltimoMes = (startMonth && maxDate) ? empRows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startMonth && d<=dateOnly(maxDate); }).length : 0;
    const osSemana = (startWeek && maxDate) ? empRows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=startWeek && d<=dateOnly(maxDate); }).length : 0;
    const osDia = dayRef ? empRows.filter(r=>dateOnly(r.dtinicio).getTime()===dayRef.getTime()).length : 0;
    const aud = auditByEmp.get(m.codKey);
    const ret = retornoByEmp.get(m.codKey);
    const qualMeses = mesesQ.map(x=>{ const a = x.mapa.get(m.codKey); return { rot:x.rot, auditorias:a?a.auditorias:0, qualidade:a&&a.qualidadeMedia!==null?a.qualidadeMedia:null }; });
    return {
      qualMeses, retornoQual: ret && ret.qualidade!==null ? ret.qualidade : null, retornoAud: ret ? ret.auditorias : 0,
      codKey: m.codKey, cod: m.codigo, nome: registry.get(m.codKey)||m.nome,
      os3m, osUltimoMes, osSemana, osDia,
      auditorias: aud ? aud.auditorias : 0,
      qualidade: aud && aud.qualidadeMedia!==null ? aud.qualidadeMedia : null
    };
  }).sort((a,b)=> a.os3m - b.os3m); // pior desempenho -> melhor desempenho
}

function renderFeedbackRankingPanel(){
  const data = getFeedbackRankingData();
  const currentTeam = window.APP_STATE.currentTeam;
  // limpa da seleção quem não está mais na lista filtrada (evita seleção "fantasma")
  const validCodes = new Set(data.map(e=>e.codKey));
  Array.from(selectedFeedbackEmployees).forEach(c=>{ if(!validCodes.has(c)) selectedFeedbackEmployees.delete(c); });

  const nSel = selectedFeedbackEmployees.size;
  const allSelected = data.length>0 && data.every(e=>selectedFeedbackEmployees.has(e.codKey));

  return `
    <div class="panel">
      <div class="panel-header">
        <h3>Ranking de Repositores</h3>
        <div class="panel-actions" style="flex-wrap:wrap;gap:10px;align-items:flex-end;">
          <div class="filter-group" style="min-width:auto;">
            <label style="font-size:10px;">Apenas Quadro Atual?</label>
            <div class="toggle-group" id="feedback-quadro-toggle">
              <button data-v="NAO" class="${!feedbackOnlyQuadroAtual?'active':''}">Não</button>
              <button data-v="SIM" class="${feedbackOnlyQuadroAtual?'active':''}">Sim</button>
            </div>
          </div>
          <div class="filter-group" style="min-width:auto;">
            <label style="font-size:10px;">Apenas Repositor?</label>
            <div class="toggle-group" id="feedback-repositor-toggle">
              <button data-v="NAO" class="${!feedbackOnlyRepositor?'active':''}">Não</button>
              <button data-v="SIM" class="${feedbackOnlyRepositor?'active':''}">Sim</button>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-download-feedback" ${nSel?'':'disabled'}>Download Feedback (PDF)${nSel>1?` — ${nSel} funcionários`:''}</button>
        </div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:4px;">
        <span class="panel-note">Ordenado do pior para o melhor desempenho (O.S. últimos 3 meses) · marque a caixa de um ou vários repositores para selecioná-los</span>
        <span class="small-muted" id="feedback-selected-label">
          ${nSel ? nSel+' funcionário(s) selecionado(s)' : 'Nenhum funcionário selecionado.'}
        </span>
      </div>
      ${feedbackOnlyRepositor && !currentTeam.cargoDisponivel ? `<div class="warn-box">A coluna CARGO não foi encontrada na aba QUADRO REP — o filtro "Apenas Repositor" não tem efeito até essa coluna existir no arquivo.</div>` : ``}
      <div class="table-wrap" style="margin-top:6px;">
        <table class="data-table" id="feedback-ranking-table">
          <thead><tr>
            <th style="width:30px;"><input type="checkbox" id="feedback-select-all" ${allSelected?'checked':''}></th>
            <th>Funcionário</th><th>Código</th><th>O.S. Últimos 3 Meses</th><th>O.S. Último Mês</th><th>O.S. Última Semana</th>
            <th>O.S. Último Dia</th><th>Auditorias (3m)</th>${(data[0]?data[0].qualMeses:[]).map(q=>`<th>Qualidade % ${q.rot}</th>`).join("")}<th>Qualidade % (média 3m)</th><th>Retornos % (3m)</th>
          </tr></thead>
          <tbody>
            ${data.map(e=>`<tr class="clickable ${selectedFeedbackEmployees.has(e.codKey)?'row-selected':''}" data-codkey="${escapeHtml(e.codKey)}" onclick="toggleFeedbackEmployee('${escapeHtml(e.codKey)}')">
              <td><input type="checkbox" class="feedback-row-check" data-codkey="${escapeHtml(e.codKey)}" ${selectedFeedbackEmployees.has(e.codKey)?'checked':''} style="pointer-events:none;"></td>
              <td>${escapeHtml(e.nome)}</td>
              <td>${e.cod||'-'}</td>
              <td>${fmtNum(e.os3m)}</td>
              <td>${fmtNum(e.osUltimoMes)}</td>
              <td>${fmtNum(e.osSemana)}</td>
              <td>${fmtNum(e.osDia)}</td>
              <td>${fmtNum(e.auditorias)}</td>
              ${e.qualMeses.map(q=>`<td>${q.qualidade!==null?fmtNum(q.qualidade,1)+'%':'-'}</td>`).join("")}
              <td><strong>${e.qualidade!==null?fmtNum(e.qualidade,1)+'%':'-'}</strong></td>
              <td title="${e.retornoAud} auditoria(s) de retorno">${e.retornoQual!==null?fmtNum(e.retornoQual,1)+'%':'-'}</td>
            </tr>`).join("") || '<tr><td colspan="13" class="small-muted">Nenhum repositor encontrado para os filtros selecionados.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function toggleFeedbackEmployee(codKey){
  if(selectedFeedbackEmployees.has(codKey)) selectedFeedbackEmployees.delete(codKey);
  else selectedFeedbackEmployees.add(codKey);
  renderFeedbacksContent();
}

function toggleFeedbackSelectAll(){
  const data = getFeedbackRankingData();
  const allSelected = data.length>0 && data.every(e=>selectedFeedbackEmployees.has(e.codKey));
  if(allSelected){
    data.forEach(e=>selectedFeedbackEmployees.delete(e.codKey));
  } else {
    data.forEach(e=>selectedFeedbackEmployees.add(e.codKey));
  }
  renderFeedbacksContent();
}

/* ---------------------------------------------------------------------- */
/* RENDER: Feedbacks                                                       */
/* ---------------------------------------------------------------------- */
const FeedbackState = { dataInicial: null, dataFinal: null };

function getFeedbackFiltered(){
  const processed = window.APP_STATE.processed;
  let rows = processed.feedback;
  if(FeedbackState.dataInicial){
    const di = dateOnly(FeedbackState.dataInicial);
    rows = rows.filter(r=>r.data && dateOnly(r.data) >= di);
  }
  if(FeedbackState.dataFinal){
    const df = dateOnly(FeedbackState.dataFinal);
    rows = rows.filter(r=>r.data && dateOnly(r.data) <= df);
  }
  return rows;
}

function renderFeedbacks(){
  const pane = $("#pane-feedbacks");
  const st = FeedbackState;
  // % Qualidade (últimos 3 meses) no ranking vem do AuditOnline (Gestão > Auditoria,
  // planilha Google Sheets) — carrega em background se ainda não tiver sido carregado
  // (ex.: usuário nunca visitou a aba Auditoria nesta sessão) e re-renderiza quando chegar.
  if(AuditOnline.rows===null && !AuditOnline.loading){
    AuditOnline.load().then(()=> renderFeedbacksContent());
  }
  if(window.RetornoOnline && RetornoOnline.rows===null && !RetornoOnline.loading){
    RetornoOnline.load().then(()=> renderFeedbacksContent());
  }
  pane.innerHTML = `
    <div class="toolbar">
      <div class="filter-group"><label>Data Inicial</label><input type="date" id="fb-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}"></div>
      <div class="filter-group"><label>Data Final</label><input type="date" id="fb-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}"></div>
      <div class="spacer"></div>
      <button class="btn btn-outline btn-sm" id="fb-clear">Limpar filtros</button>
    </div>
    <div id="fb-content"></div>
  `;
  $("#fb-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderFeedbacks(); });
  $("#fb-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderFeedbacks(); });
  $("#fb-clear").addEventListener("click", ()=>{ FeedbackState.dataInicial=null; FeedbackState.dataFinal=null; renderFeedbacks(); });
  renderFeedbacksContent();
}

function renderFeedbacksContent(){
  FeedbackAdv.render();

  const dlBtn = $("#btn-download-feedback");
  if(dlBtn) dlBtn.addEventListener("click", ()=>{
    if(!selectedFeedbackEmployees.size) return;
    const data = getFeedbackRankingData();
    const emps = data.filter(e=>selectedFeedbackEmployees.has(e.codKey));
    if(emps.length) FeedbackDoc.generateMultiple(emps);
  });

  const selectAllChk = $("#feedback-select-all");
  if(selectAllChk) selectAllChk.addEventListener("click", ()=> toggleFeedbackSelectAll());

  const fbQuadroToggle = $("#feedback-quadro-toggle");
  if(fbQuadroToggle) fbQuadroToggle.addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    feedbackOnlyQuadroAtual = b.dataset.v === "SIM";
    renderFeedbacksContent();
  });
  const fbRepositorToggle = $("#feedback-repositor-toggle");
  if(fbRepositorToggle) fbRepositorToggle.addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    feedbackOnlyRepositor = b.dataset.v === "SIM";
    renderFeedbacksContent();
  });
}

/* ---------------------------------------------------------------------- */
/* RENDER: Quadro                                                          */
/* ---------------------------------------------------------------------- */
let quadroShowComissao = false;
let producaoOnlyRepositor = true; // filtro "apenas Cargo=REPOSITOR" no Ranking e na Projeção por Funcionário — inicia SIM
let rankingSelectedPeriod = "mes-atual"; // persiste a seleção do dropdown de período do ranking entre re-renders

// Retorna o Set de codKeys marcados como REPOSITOR no quadro atual (coluna CARGO da QUADRO REP).
// Se a coluna CARGO não existir no arquivo, retorna null (sinaliza que o filtro não tem efeito).
function getRepositorCodeSet(){
  const currentTeam = window.APP_STATE.currentTeam;
  if(!currentTeam || !currentTeam.cargoDisponivel) return null;
  return currentTeam.repositorCodes;
}
const QuadroState = { dataInicial: null, dataFinal: null };

function renderQuadro(){
  const pane = $("#pane-quadro");
  const currentTeam = window.APP_STATE.currentTeam;
  const registry = window.APP_STATE.nameRegistry;
  const processed = window.APP_STATE.processed;
  const st = QuadroState;
  const feedbackByEmp = new Map(Feedback.byEmployee().map(e=>[e.codKey,e]));
  const commission = Commission.computeAll(st.dataInicial, st.dataFinal);
  const commByEmp = new Map(commission.map(e=>[e.codKey,e]));
  const temMissoes = processed.missoesDispo;

  // produção por funcionário (8460, TIPOOS=58) — respeitando filtro de data
  const prod8460Rows = processed.p8460.filter(r=>{
    if(r.tipoos!==58 || !r.codKey) return false;
    if(st.dataInicial && dateOnly(r.dtinicio) < dateOnly(st.dataInicial)) return false;
    if(st.dataFinal && dateOnly(r.dtinicio) > dateOnly(st.dataFinal)) return false;
    return true;
  });
  const prod8460 = new Map();
  prod8460Rows.forEach(r=>{ prod8460.set(r.codKey, (prod8460.get(r.codKey)||0)+1); });

  // missões por funcionário — respeitando filtro de data
  // Novo cálculo: O.S. da Missão = Média Diária do Colaborador × (Tempo Total ÷ 9h)
  const missoesPorFuncionario = Missions.realMissionsOsAll(st.dataInicial, st.dataFinal);

  // feedbacks/advertências também respeitando o filtro de data
  const feedbackFiltrado = processed.feedback.filter(r=>{
    if(!r.data) return true; // sem data, não filtra
    if(st.dataInicial && dateOnly(r.data) < dateOnly(st.dataInicial)) return false;
    if(st.dataFinal && dateOnly(r.data) > dateOnly(st.dataFinal)) return false;
    return true;
  });
  const fbByEmpFiltrado = new Map();
  feedbackFiltrado.forEach(r=>{
    const key = r.codKey;
    if(!key) return;
    if(!fbByEmpFiltrado.has(key)) fbByEmpFiltrado.set(key, { feedbacks:0, advertencias:0 });
    const e = fbByEmpFiltrado.get(key);
    e.feedbacks++;
    if(r.isAdvertencia) e.advertencias++;
  });

  const cargoOrdem = { LIDER:0, AUXILIAR:1, REPOSITOR:2 };
  const rows = currentTeam.members.map(m=>{
    const fb = fbByEmpFiltrado.get(m.codKey);
    const co = commByEmp.get(m.codKey);
    const mis = missoesPorFuncionario.get(m.codKey);
    return {
      codKey:m.codKey, cod: m.codigo, nome: registry.get(m.codKey)||m.nome, status:m.statusRaw,
      cargo: m.cargo, cargoRaw: m.cargoRaw,
      feedbacks: fb?fb.feedbacks:0, advertencias: fb?fb.advertencias:0,
      os58: prod8460.get(m.codKey)||0,
      missoes: mis ? mis.totalOs : 0,
      pontos: co?co.pontos:0,
      comissao: co?co.comissaoTotal:0
    };
  }).sort((a,b)=>{
    const oa = cargoOrdem[a.cargo] !== undefined ? cargoOrdem[a.cargo] : 99;
    const ob = cargoOrdem[b.cargo] !== undefined ? cargoOrdem[b.cargo] : 99;
    if(oa !== ob) return oa - ob;
    return a.nome.localeCompare(b.nome);
  });

  // badge de período
  const filtroAtivo = st.dataInicial || st.dataFinal;
  const badge = filtroAtivo
    ? `<div class="hint-box">📅 Filtro ativo: <strong>${st.dataInicial?fmtDateBR(st.dataInicial):'início'}</strong> até <strong>${st.dataFinal?fmtDateBR(st.dataFinal):'hoje'}</strong> — O.S. 58, Missões, Feedbacks e Comissão refletem apenas este período</div>`
    : `<div class="hint-box">📊 Exibindo <strong>todo o histórico</strong> de O.S. 58, Missões, Feedbacks e Comissão. Use o filtro de data para restringir a um período (ex: mês atual).</div>`;

  const cargoLabel = { LIDER:"Líder", AUXILIAR:"Auxiliar", REPOSITOR:"Repositor" };
  const cargoTag = (c) => c ? `<span class="tag-${c==='REPOSITOR'?'neutral':c==='LIDER'?'warn':'pos'}">${cargoLabel[c]||c}</span>` : `<span class="small-muted">—</span>`;

  pane.innerHTML = `
    <div class="toolbar">
      <div class="filter-group"><label>Data Inicial</label><input type="date" id="quadro-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}"></div>
      <div class="filter-group"><label>Data Final</label><input type="date" id="quadro-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}"></div>
      <div class="filter-group">
        <label>Atalhos</label>
        <div id="quadro-atalhos" style="display:flex;gap:4px;flex-wrap:wrap;">
          ${renderAtalhos(atalhoAtivoPorDatas(st.dataInicial,st.dataFinal,['mes_atual','mes_ant']),'atalhoQuadro',['mes_atual','mes_ant','tudo'])}
        </div>
      </div>
      <div class="spacer"></div>
      <button class="btn btn-outline btn-sm" id="quadro-clear">Limpar filtros</button>
    </div>

    ${badge}

    ${!currentTeam.cargoDisponivel ? `<div class="warn-box">A coluna <strong>CARGO</strong> não foi encontrada na aba QUADRO REP. Adicione essa coluna (valores: LIDER, AUXILIAR ou REPOSITOR) para os cards abaixo e a contagem de repositores refletirem os cargos reais da equipe. Até lá, todo o quadro atual é contado como repositor.</div>` : ``}

    <div class="hint-box" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
      <span>Quadro atual: <strong>${currentTeam.date?fmtDateBR(currentTeam.date):'-'}</strong> · ${currentTeam.repositorCodes.size} repositores${currentTeam.cargoDisponivel && currentTeam.members.length!==currentTeam.repositorCodes.size ? ' ('+currentTeam.members.length+' pessoas no quadro total)' : ' ativos'}</span>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-outline btn-sm" id="btn-toggle-comissao">${quadroShowComissao?'Ocultar Comissão':'Mostrar Comissão'}</button>
        ${!temMissoes?`<span class="tag-warn">Aba MISSÕES não encontrada no arquivo</span>`:`<span class="tag-pos">${processed.missoes.length} missão(ões) registrada(s) no total</span>`}
      </div>
    </div>
    <div class="panel" id="quadro-consolidado-panel">
      <div class="cards-grid">
        <div class="card"><div class="card-label">👑 Líder</div><div class="card-value">${fmtNum(currentTeam.cargoCounts.LIDER)}</div></div>
        <div class="card"><div class="card-label">🛠️ Auxiliar</div><div class="card-value">${fmtNum(currentTeam.cargoCounts.AUXILIAR)}</div></div>
        <div class="card pos"><div class="card-label">📦 Repositor</div><div class="card-value pos">${fmtNum(currentTeam.cargoCounts.REPOSITOR)}</div></div>
        ${currentTeam.cargoCounts.OUTRO>0 ? `<div class="card warn"><div class="card-label">Outro Cargo</div><div class="card-value warn">${fmtNum(currentTeam.cargoCounts.OUTRO)}</div></div>` : ``}
        ${currentTeam.cargoCounts.NAO_INFORMADO>0 ? `<div class="card"><div class="card-label">Sem Cargo Informado</div><div class="card-value">${fmtNum(currentTeam.cargoCounts.NAO_INFORMADO)}</div></div>` : ``}
      </div>
      <div class="panel-header">
        <h3>Quadro Consolidado</h3>
        <div class="panel-actions">
          <button class="btn btn-outline btn-sm" id="btn-export-quadro-pdf">Exportar PDF (1 página)</button>
        </div>
      </div>
      <div class="table-wrap"><table class="data-table" id="quadro-table">
        <thead><tr>
          <th>Código</th><th>Funcionário</th><th>Cargo</th><th>Status</th><th>Feedbacks</th><th>Advertências</th>
          ${quadroShowComissao?'<th>Comissão</th>':''}
        </tr></thead>
        <tbody>
          ${rows.map(r=>`<tr class="clickable" onclick="showEmployeeSummary('${r.codKey}')">
            <td>${r.cod||'-'}</td><td>${escapeHtml(r.nome)}</td><td>${cargoTag(r.cargo)}</td><td>${escapeHtml(r.status)}</td>
            <td>${r.feedbacks}</td>
            <td class="${r.advertencias>0?'cell-neg':''}">${r.advertencias}</td>
            ${quadroShowComissao?`<td><strong>${fmtBRL(r.comissao)}</strong></td>`:''}
          </tr>`).join("")}
        </tbody>
      </table></div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Validador de Quadro — RH</h3>
        <span class="panel-note">Cole a lista enviada pelo RH e compare com o seu quadro atual</span>
      </div>
      <div class="hint-box">
        Formatos aceitos por linha: <strong>Código&nbsp;&nbsp;Nome</strong> (Tab) &nbsp;·&nbsp;
        <strong>Código,&nbsp;Nome</strong> &nbsp;·&nbsp; <strong>Código;Nome</strong> &nbsp;·&nbsp;
        Apenas <strong>Código</strong> &nbsp;·&nbsp; Apenas <strong>Nome</strong>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:10px;">
        <textarea id="rh-quadro-input" rows="9"
          placeholder="Cole aqui o quadro do RH — um funcionário por linha. Exemplos:
10003932	ALICE KAUANE PEREIRA SILVA
10003928	KETNEY CRISTINE ALVES DOS SANTOS"
          style="flex:1;font-family:monospace;font-size:12px;padding:8px;border:1px solid #dde3ea;border-radius:6px;resize:vertical;"></textarea>
        <div style="display:flex;flex-direction:column;gap:8px;justify-content:flex-start;padding-top:4px;">
          <button class="btn btn-primary" id="btn-rh-validar">Validar</button>
          <button class="btn btn-outline btn-sm" id="btn-rh-limpar">Limpar</button>
        </div>
      </div>
      <div id="rh-resultado"></div>
    </div>
  `;

  $("#btn-rh-validar").addEventListener("click", ()=> validarQuadroRH());
  $("#btn-rh-limpar").addEventListener("click", ()=>{
    const inp = document.getElementById("rh-quadro-input");
    const res = document.getElementById("rh-resultado");
    if(inp) inp.value = "";
    if(res) res.innerHTML = "";
  });

  $("#btn-export-quadro-pdf").addEventListener("click", ()=>{
    Export.toPDFSinglePage(document.getElementById("quadro-consolidado-panel"), "quadro-consolidado", "portrait");
  });

  $("#btn-toggle-comissao").addEventListener("click", ()=>{
    quadroShowComissao = !quadroShowComissao;
    renderQuadro();
  });
  $("#quadro-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderQuadro(); });
  $("#quadro-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderQuadro(); });
  $("#quadro-clear").addEventListener("click", ()=>{ st.dataInicial=null; st.dataFinal=null; renderQuadro(); });
}

function validarQuadroRH(){
  const textarea = document.getElementById("rh-quadro-input");
  const resultado = document.getElementById("rh-resultado");
  if(!textarea || !resultado) return;

  const texto = textarea.value.trim();
  if(!texto){ resultado.innerHTML = `<div class="warn-box">Cole a lista do RH antes de validar.</div>`; return; }

  const currentTeam = window.APP_STATE.currentTeam;
  const registry = window.APP_STATE.nameRegistry;

  // Parsing da lista do RH — aceita Tab, vírgula, ponto-e-vírgula ou linha só com código/nome
  const rhRows = texto.split('\n').map(l=>l.trim()).filter(Boolean).map(linha=>{
    // tenta separar por Tab, vírgula ou ponto-e-vírgula
    const sep = linha.includes('\t') ? '\t' : linha.includes(';') ? ';' : linha.includes(',') ? ',' : null;
    if(sep){
      const parts = linha.split(sep).map(p=>p.trim());
      const codRaw = parts[0], nomeRaw = parts.slice(1).join(' ').trim();
      // verifica se a primeira parte parece ser um código numérico
      if(/^\d+$/.test(codRaw)) return { codigo: codRaw, codKey: normStr(codRaw), nome: nomeRaw.toUpperCase() };
      // pode ser nome, código (ordem invertida)
      if(/^\d+$/.test(parts[parts.length-1])) return { codigo: parts[parts.length-1], codKey: normStr(parts[parts.length-1]), nome: parts.slice(0,-1).join(' ').trim().toUpperCase() };
    }
    // linha com apenas código ou apenas nome
    if(/^\d{5,}$/.test(linha)) return { codigo: linha, codKey: normStr(linha), nome: null };
    return { codigo: null, codKey: null, nome: linha.toUpperCase() };
  });

  // Quadro atual do sistema (codKey → { codigo, nome })
  const sistemaMap = new Map(currentTeam.members.map(m=>[ m.codKey, { codigo: m.codigo, nome: registry.get(m.codKey)||m.nome } ]));
  const sistemaNomeMap = new Map(currentTeam.members.map(m=>[ normStr(registry.get(m.codKey)||m.nome), m.codKey ]));

  // Mapa RH para lookup
  const rhCodMap = new Map(rhRows.filter(r=>r.codKey).map(r=>[r.codKey, r]));
  const rhNomeMap = new Map(rhRows.filter(r=>r.nome).map(r=>[normStr(r.nome), r]));

  // Categorias de resultado
  const ok = [];           // batem por código
  const nomeOkCodDiv = []; // mesmo nome, código diferente ou ausente
  const rhNaoNoSistema = []; // RH tem, sistema não tem
  const sistemaNaoNoRH = []; // sistema tem, RH não tem

  // 1. Verifica cada linha do RH
  rhRows.forEach(r=>{
    if(r.codKey && sistemaMap.has(r.codKey)){
      const sis = sistemaMap.get(r.codKey);
      const nomeRHNorm = r.nome ? normStr(r.nome) : null;
      const nomeSisNorm = normStr(sis.nome);
      if(!nomeRHNorm || nomeSisNorm === nomeRHNorm || nomeSisNorm.includes(nomeRHNorm) || nomeRHNorm.includes(nomeSisNorm)){
        ok.push({ codigo: r.codigo||sis.codigo, nome: sis.nome, obs: '' });
      } else {
        // código bate mas nome diferente
        nomeOkCodDiv.push({ tipo:'nome_diferente', rhCodigo: r.codigo, rhNome: r.nome||'—', sisCodigo: sis.codigo, sisNome: sis.nome });
      }
    } else if(r.nome && sistemaNomeMap.has(normStr(r.nome))){
      // nome bate mas código ausente/diferente no RH
      const codSis = sistemaNomeMap.get(normStr(r.nome));
      const sis = sistemaMap.get(codSis);
      nomeOkCodDiv.push({ tipo:'cod_divergente', rhCodigo: r.codigo||'—', rhNome: r.nome, sisCodigo: sis.codigo, sisNome: sis.nome });
    } else if(r.codKey || r.nome){
      rhNaoNoSistema.push({ codigo: r.codigo||'—', nome: r.nome||'—' });
    }
  });

  // 2. Verifica quem do sistema não apareceu no RH
  currentTeam.members.forEach(m=>{
    const inRHByCod = rhCodMap.has(m.codKey);
    const inRHByNome = sistemaNomeMap.has(normStr(registry.get(m.codKey)||m.nome)) && rhNomeMap.has(normStr(registry.get(m.codKey)||m.nome));
    if(!inRHByCod && !inRHByNome){
      sistemaNaoNoRH.push({ codigo: m.codigo, nome: registry.get(m.codKey)||m.nome });
    }
  });

  // Renderizar resultado
  const total = currentTeam.members.length;
  const totalRH = rhRows.length;

  const secao = (titulo, cor, lista, cols, fn) => lista.length === 0 ? '' : `
    <div style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="background:${cor}22;color:${cor};font-size:11px;font-weight:800;padding:3px 12px;border-radius:10px;">${titulo} (${lista.length})</span>
      </div>
      <div class="table-wrap"><table class="data-table"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${lista.map(fn).join('')}</tbody></table></div>
    </div>`;

  resultado.innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
      <div class="card pos" style="flex:1;min-width:120px;"><div class="card-label">✅ Batem</div><div class="card-value pos">${ok.length}</div><div class="card-sub">de ${totalRH} do RH</div></div>
      <div class="card ${nomeOkCodDiv.length?'warn':''}" style="flex:1;min-width:120px;"><div class="card-label">⚠️ Divergência de Código/Nome</div><div class="card-value ${nomeOkCodDiv.length?'warn':''}">${nomeOkCodDiv.length}</div><div class="card-sub">mesmo colaborador, dados diferentes</div></div>
      <div class="card ${rhNaoNoSistema.length?'neg':''}" style="flex:1;min-width:120px;"><div class="card-label">❌ No RH, falta no Sistema</div><div class="card-value ${rhNaoNoSistema.length?'neg':''}">${rhNaoNoSistema.length}</div><div class="card-sub">presentes no RH, ausentes aqui</div></div>
      <div class="card ${sistemaNaoNoRH.length?'neg':''}" style="flex:1;min-width:120px;"><div class="card-label">⚠️ No Sistema, falta no RH</div><div class="card-value ${sistemaNaoNoRH.length?'warn':''}">${sistemaNaoNoRH.length}</div><div class="card-sub">presentes aqui, ausentes no RH</div></div>
      <div class="card" style="flex:1;min-width:120px;"><div class="card-label">👥 Quadro Sistema</div><div class="card-value">${total}</div><div class="card-sub">vs RH: ${totalRH}</div></div>
    </div>

    ${secao('❌ No RH mas NÃO encontrado no Sistema','#d64545',rhNaoNoSistema,['Código RH','Nome RH'],r=>`<tr><td>${escapeHtml(r.codigo)}</td><td>${escapeHtml(r.nome)}</td></tr>`)}
    ${secao('⚠️ No Sistema mas NÃO encontrado no RH','#e08a1f',sistemaNaoNoRH,['Código Sistema','Nome Sistema'],r=>`<tr><td>${escapeHtml(r.codigo||'—')}</td><td>${escapeHtml(r.nome)}</td></tr>`)}
    ${secao('⚠️ Divergência de Código ou Nome','#9c6ade',nomeOkCodDiv,['Código RH','Nome RH','Código Sistema','Nome Sistema','Tipo'],r=>`<tr>
      <td>${escapeHtml(r.rhCodigo||'—')}</td><td>${escapeHtml(r.rhNome||'—')}</td>
      <td>${escapeHtml(r.sisCodigo||'—')}</td><td>${escapeHtml(r.sisNome||'—')}</td>
      <td><span class="tag-warn">${r.tipo==='nome_diferente'?'Nome diferente':'Código divergente'}</span></td>
    </tr>`)}
    ${ok.length && !rhNaoNoSistema.length && !sistemaNaoNoRH.length && !nomeOkCodDiv.length
      ? `<div class="card pos" style="padding:14px 18px;text-align:center;"><div class="card-label">🎉 Quadros Idênticos!</div><div style="font-size:13px;color:#1a9c62;margin-top:4px;">Todos os ${ok.length} colaboradores do RH batem com o sistema. Nenhuma divergência encontrada.</div></div>`
      : ''}
  `;
}

function showEmployeeSummary(codKey){
  const registry = window.APP_STATE.nameRegistry;
  const nome = registry.get(codKey) || codKey;
  const prodRows = window.APP_STATE.processed.p8460.filter(r=>r.tipoos===58 && r.codKey===codKey);
  const fb = Feedback.byEmployee().find(e=>e.codKey===codKey);
  const ad = Audit.byRepositor().find(e=>e.codKey===codKey);
  const co = Commission.computeAll().find(e=>e.codKey===codKey);
  const att = Attendance.individualHistory(codKey);

  UI.openModal(`
    <h3>${escapeHtml(nome)}</h3>
    <div class="grid-2">
      <div>
        <p><strong>Produção (O.S. 58):</strong> ${fmtNum(prodRows.length)}</p>
        <p><strong>Missões (O.S. equiv.):</strong> ${co?fmtNum(co.missoesOs):0} &nbsp; <strong>Pontos Totais:</strong> ${co?fmtNum(co.pontos):0}</p>
        <p><strong>Comissão:</strong> ${co?fmtBRL(co.comissaoTotal):fmtBRL(0)}</p>
        <p><strong>Regra aplicada:</strong> ${co?co.regra:'-'} ${co?`(R$ ${fmtNum(co.valorPonto,2)}/pt)`:''}</p>
      </div>
      <div>
        <p><strong>Feedbacks:</strong> ${fb?fb.feedbacks:0} &nbsp; <strong>Advertências:</strong> ${fb?fb.advertencias:0}</p>
        <p><strong>Av. Pessoal:</strong> ${fb&&fb.mediaPessoal!==null?fmtNum(fb.mediaPessoal,1):'-'} &nbsp; <strong>Av. Gestor:</strong> ${fb&&fb.mediaGestor!==null?fmtNum(fb.mediaGestor,1):'-'}</p>
        <p><strong>Classificação:</strong> ${fb&&fb.classificacao?fb.classificacao.label:'-'}</p>
        <p><strong>Auditorias:</strong> ${ad?ad.auditorias:0} &nbsp; <strong>Qualidade média:</strong> ${ad&&ad.qualidadeMedia!==null?fmtNum(ad.qualidadeMedia,1)+'%':'-'}</p>
      </div>
    </div>
    <hr style="border:none;border-top:1px solid var(--gray-200);margin:14px 0;">
    <p><strong>Presença:</strong> ${att.presencaPct!==null?fmtNum(att.presencaPct,1)+'%':'-'}</p>
    <div class="cards-grid">
      <div class="card"><div class="card-label">Presente</div><div class="card-value">${att.counts.PRESENTE}</div></div>
      <div class="card"><div class="card-label">Seg. Turno</div><div class="card-value">${att.counts.SEGUNDO_TURNO}</div></div>
      <div class="card neg"><div class="card-label">Faltas</div><div class="card-value neg">${att.counts.FALTA}</div></div>
      <div class="card"><div class="card-label">Folgas</div><div class="card-value">${att.counts.FOLGA}</div></div>
      <div class="card"><div class="card-label">Férias</div><div class="card-value">${att.counts.FERIAS}</div></div>
      <div class="card"><div class="card-label">Atestados</div><div class="card-value">${att.counts.ATESTADO}</div></div>
    </div>
  `);
}

/* ---------------------------------------------------------------------- */
/* RENDER: Chamada                                                         */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* Relatório estilizado de Presença — Quadro Atual (export PDF/PNG)        */
/* ---------------------------------------------------------------------- */
function buildQuadroAtualReportContainer(quadroAtualRows, scounts, maxDate, registry){
  const DIAS_SEMANA_ABREV = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const MESES_ABREV = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const dataLabel = maxDate ? `${DIAS_SEMANA_ABREV[maxDate.getDay()]}, ${String(maxDate.getDate()).padStart(2,'0')}/${MESES_ABREV[maxDate.getMonth()]}/${maxDate.getFullYear()}` : "-";
  const dataCurta = maxDate ? fmtDateBR(maxDate) : "-";

  const total = quadroAtualRows.length;
  const presentesTotal = (scounts.PRESENTE||0) + (scounts.SEGUNDO_TURNO||0);

  const statusLabelMap = { PRESENTE:"PRESENTE", SEGUNDO_TURNO:"SEG. TURNO", FALTA:"FALTA", FOLGA:"FOLGA", FERIAS:"FÉRIAS", ATESTADO:"ATESTADO", SUSPENSAO:"SUSPENSÃO" };
  const pillColorMap = { PRESENTE:"#1a9c62", SEGUNDO_TURNO:"#2f6fce", FALTA:"#d64545", FOLGA:"#7a8798", FERIAS:"#9c6ade", ATESTADO:"#e08a1f", SUSPENSAO:"#8a2be2" };

  const nomesPorBucket = (bucket) => quadroAtualRows.filter(r=>r.bucket===bucket)
    .map(r=>escapeHtml(registry.get(r.codKey)||r.nome))
    .sort((a,b)=>a.localeCompare(b));

  const ausenciaBox = (label, bucket, color) => {
    const nomes = nomesPorBucket(bucket);
    return `
      <div style="flex:1;border:1px solid #dde3ea;border-radius:8px;padding:12px 14px;background:#fff;">
        <div style="font-size:11px;font-weight:800;color:#123a6b;letter-spacing:.3px;margin-bottom:8px;">${label} <span style="color:${color};">(${nomes.length})</span></div>
        ${nomes.length
          ? nomes.map(n=>`<div style="font-size:11px;color:#2f6fce;padding:3px 0;border-bottom:1px solid #f4f6f9;">${n}</div>`).join("")
          : `<div style="font-size:11px;color:#9aa5b1;font-style:italic;">Nenhum</div>`}
      </div>`;
  };

  const statCard = (label, value) => `
    <div style="flex:1;background:#123a6b;border-radius:8px;padding:16px 8px;text-align:center;">
      <div style="font-size:26px;font-weight:800;color:#e08a1f;line-height:1;">${value}</div>
      <div style="font-size:9px;font-weight:700;color:#cfe3fb;letter-spacing:.5px;margin-top:6px;">${label}</div>
    </div>`;

  const listaOrdenada = [...quadroAtualRows].sort((a,b)=>(registry.get(a.codKey)||a.nome).localeCompare(registry.get(b.codKey)||b.nome));

  const el = document.createElement("div");
  el.id = "quadroatual-report-container";
  el.style.cssText = "position:fixed; left:-99999px; top:0; width:1100px; background:#f4f6f9; font-family:-apple-system,Segoe UI,Arial,sans-serif; color:#1f2937;";

  el.innerHTML = `
    <div style="background:#0b2647;padding:28px 32px 22px;border-bottom:3px solid #e08a1f;">
      <div style="font-size:30px;font-weight:800;color:#fff;">Núcleo Reposição</div>
      <div style="font-size:13px;color:#9db8dd;margin-top:6px;">Relatório de presença — ${dataLabel}</div>
    </div>

    <div style="padding:22px 32px 4px;">
      <div style="display:flex;gap:10px;margin-bottom:22px;">
        ${statCard("TOTAL", fmtNum(total))}
        ${statCard("PRESENTES", fmtNum(presentesTotal))}
        ${statCard("SEG. TURNO", fmtNum(scounts.SEGUNDO_TURNO||0))}
        ${statCard("FALTAS", fmtNum(scounts.FALTA||0))}
        ${statCard("FOLGAS", fmtNum(scounts.FOLGA||0))}
        ${statCard("FÉRIAS", fmtNum(scounts.FERIAS||0))}
        ${statCard("ATESTADOS", fmtNum(scounts.ATESTADO||0))}
      </div>

      <div style="font-size:13px;font-weight:800;color:#123a6b;letter-spacing:.3px;margin-bottom:10px;">AUSÊNCIAS DO DIA</div>
      <div style="display:flex;gap:10px;margin-bottom:22px;">
        ${ausenciaBox("FÉRIAS", "FERIAS", "#9c6ade")}
        ${ausenciaBox("FOLGA", "FOLGA", "#7a8798")}
        ${ausenciaBox("FALTA", "FALTA", "#d64545")}
        ${ausenciaBox("ATESTADO", "ATESTADO", "#e08a1f")}
      </div>

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="width:10px;height:10px;border-radius:50%;background:#1a9c62;display:inline-block;"></span>
        <span style="font-size:13px;font-weight:800;color:#123a6b;">REGISTRO DE PRESENÇA (${presentesTotal})</span>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;margin-bottom:0;">
        <thead>
          <tr style="background:#0b2647;">
            <th style="text-align:left;padding:9px 14px;font-size:10px;font-weight:800;color:#cfe3fb;letter-spacing:.4px;">CÓDIGO</th>
            <th style="text-align:left;padding:9px 14px;font-size:10px;font-weight:800;color:#cfe3fb;letter-spacing:.4px;">NOME</th>
            <th style="text-align:left;padding:9px 14px;font-size:10px;font-weight:800;color:#cfe3fb;letter-spacing:.4px;">STATUS</th>
            <th style="text-align:left;padding:9px 14px;font-size:10px;font-weight:800;color:#cfe3fb;letter-spacing:.4px;">DATA</th>
          </tr>
        </thead>
        <tbody>
          ${listaOrdenada.filter(r=>r.bucket==="PRESENTE"||r.bucket==="SEGUNDO_TURNO").map((r,i)=>{
            const nome = escapeHtml(registry.get(r.codKey)||r.nome);
            const pillColor = pillColorMap[r.bucket];
            const pillLabel = statusLabelMap[r.bucket];
            return `<tr style="background:${i%2===0?'#fff':'#f7f9fb'};">
              <td style="padding:8px 14px;font-size:11.5px;color:#2f6fce;font-weight:700;border-top:1px solid #eef1f4;">${r.codigo||'-'}</td>
              <td style="padding:8px 14px;font-size:11.5px;color:#123a6b;font-weight:700;border-top:1px solid #eef1f4;">${nome}</td>
              <td style="padding:8px 14px;border-top:1px solid #eef1f4;"><span style="background:${pillColor}22;color:${pillColor};font-size:9.5px;font-weight:800;padding:3px 10px;border-radius:10px;">${pillLabel}</span></td>
              <td style="padding:8px 14px;font-size:11.5px;color:#7a8798;border-top:1px solid #eef1f4;">${dataCurta}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>

    <div style="display:flex;justify-content:space-between;padding:14px 32px;margin-top:14px;font-size:10px;color:#9aa5b1;border-top:1px solid #dde3ea;">
      <span>Núcleo Reposição — Painel de Gestão</span>
      <span>Gerado em ${fmtDateBR(new Date())}</span>
    </div>
  `;

  document.body.appendChild(el);
  return el;
}

function renderChamada(){
  const pane = $("#pane-chamada");
  const processed = window.APP_STATE.processed;
  const currentTeam = window.APP_STATE.currentTeam;
  const registry = window.APP_STATE.nameRegistry;

  // ---- RESUMO ESTÁTICO: quadro atual (última data) ----
  const maxDate = currentTeam.date;
  const quadroAtualRows = maxDate
    ? processed.quadro.filter(r=>r.data.getTime()===maxDate.getTime())
    : [];
  const scounts = { PRESENTE:0, FALTA:0, FOLGA:0, FERIAS:0, ATESTADO:0, SEGUNDO_TURNO:0 };
  quadroAtualRows.forEach(r=>{ scounts[r.bucket] = (scounts[r.bucket]||0)+1; });
  const spres = scounts.PRESENTE + scounts.SEGUNDO_TURNO;
  const sdenom = spres + scounts.FALTA;
  const spresPct = sdenom>0 ? spres/sdenom*100 : null;

  const listaAtual = quadroAtualRows.sort((a,b)=>(registry.get(a.codKey)||a.nome).localeCompare(registry.get(b.codKey)||b.nome));

  // ---- HISTÓRICO FILTRADO ----
  const st = Attendance.state;
  const histRows = Attendance.getRows();
  const s = Attendance.summary();
  const byDay = Attendance.byDay();
  const faltantes = Attendance.faltantes();

  const histDates = histRows.map(r=>r.data).filter(Boolean);
  const histMin = histDates.length ? new Date(Math.min(...histDates.map(d=>d.getTime()))) : null;
  const histMax = histDates.length ? new Date(Math.max(...histDates.map(d=>d.getTime()))) : null;

  // ranking atestados
  const atestados = (() => {
    const m = new Map();
    histRows.filter(r=>r.bucket==="ATESTADO").forEach(r=>{
      if(!m.has(r.codKey)) m.set(r.codKey, { codKey:r.codKey, cod:r.codigo, nome: registry.get(r.codKey)||r.nome, qtd:0 });
      m.get(r.codKey).qtd++;
    });
    return Array.from(m.values()).sort((a,b)=>b.qtd-a.qtd);
  })();

  // ranking seg. turno
  const segTurno = (() => {
    const m = new Map();
    histRows.filter(r=>r.bucket==="SEGUNDO_TURNO").forEach(r=>{
      if(!m.has(r.codKey)) m.set(r.codKey, { codKey:r.codKey, cod:r.codigo, nome: registry.get(r.codKey)||r.nome, qtd:0 });
      m.get(r.codKey).qtd++;
    });
    return Array.from(m.values()).sort((a,b)=>b.qtd-a.qtd);
  })();

  // mês a mês presença
  // sempre TODOS os meses (inclusive o corrente, marcado como em andamento), sem depender do filtro de datas do histórico
  const mesCorrenteKey = ymKey(new Date());
  const byMonth = (() => {
    const m = new Map();
    processed.quadro.forEach(r=>{
      const k = ymKey(r.data);
      if(!m.has(k)) m.set(k, { key:k, date:r.data, PRESENTE:0, FALTA:0, FOLGA:0, FERIAS:0, ATESTADO:0, SEGUNDO_TURNO:0 });
      m.get(k)[r.bucket] = (m.get(k)[r.bucket]||0)+1;
    });
    return Array.from(m.values()).sort((a,b)=>a.key-b.key).map(d=>{
      const base = d.PRESENTE+d.SEGUNDO_TURNO, den = base+d.FALTA;
      return { ...d, label: fmtMonthYear(Math.floor(d.key/100), (d.key%100)-1), presencaPct: den>0?base/den*100:null, absenteismoPct: den>0?d.FALTA/den*100:null, emAndamento: d.key===mesCorrenteKey };
    });
  })();

  const tipLinha = (cor, nome, v)=> `<div class="tip-l"><span class="tip-d" style="background:${cor}"></span><span>${nome}</span><b>${fmtNum(v)}</b></div>`;
  const tipQtds = `<div class="tip-t">Quantidades no período</div>` +
    tipLinha("#1a9c62","Presentes",s.counts.PRESENTE) + tipLinha("#5b9bd5","Seg. Turno",s.counts.SEGUNDO_TURNO) + tipLinha("#d64545","Faltas",s.counts.FALTA) +
    tipLinha("#8a97a8","Folgas",s.counts.FOLGA) + tipLinha("#9c6ade","Férias",s.counts.FERIAS) + tipLinha("#e08a1f","Atestados",s.counts.ATESTADO);

  const statusColor = { PRESENTE:"var(--green)", FALTA:"var(--red)", FOLGA:"var(--gray-500)", FERIAS:"#9c6ade", ATESTADO:"var(--orange)", SEGUNDO_TURNO:"#5b9bd5", SUSPENSAO:"#8a2be2" };
  const statusLabel = { PRESENTE:"Presente", FALTA:"Falta", FOLGA:"Folga", FERIAS:"Férias", ATESTADO:"Atestado", SEGUNDO_TURNO:"Seg. Turno", SUSPENSAO:"Suspensão" };

  pane.innerHTML = `
    <!-- ===== BLOCO 1: RESUMO ESTÁTICO DO QUADRO ATUAL ===== -->
    <div class="panel" style="border-left:4px solid var(--blue-med);">
      <div class="panel-header">
        <h3>Quadro Atual — ${fmtDateBR(maxDate)} (estático)</h3>
        <div class="panel-actions">
          <button class="btn btn-outline btn-sm" id="btn-export-quadroatual-pdf">PDF</button>
          <button class="btn btn-outline btn-sm" id="btn-export-quadroatual-png">PNG</button>
        </div>
      </div>
      <div class="cards-grid" style="margin-bottom:16px;">
        <div class="card ${spresPct>=90?'pos':spresPct<80?'neg':'warn'}">
          <div class="card-label">% Presença hoje</div>
          <div class="card-value ${spresPct>=90?'pos':spresPct<80?'neg':'warn'}">${spresPct!==null?fmtNum(spresPct,1)+'%':'-'}</div>
        </div>
        <div class="card"><div class="card-label">Presentes</div><div class="card-value">${scounts.PRESENTE}</div></div>
        <div class="card"><div class="card-label">Seg. Turno</div><div class="card-value">${scounts.SEGUNDO_TURNO}</div></div>
        <div class="card neg"><div class="card-label">Faltas</div><div class="card-value neg">${scounts.FALTA}</div></div>
        <div class="card"><div class="card-label">Folgas</div><div class="card-value">${scounts.FOLGA}</div></div>
        <div class="card"><div class="card-label">Férias</div><div class="card-value">${scounts.FERIAS}</div></div>
        <div class="card"><div class="card-label">Atestados</div><div class="card-value">${scounts.ATESTADO}</div></div>
      </div>

      <div id="quadroatual-export-area">
        <div class="chart-wrap"><canvas id="chart-status-atual"></canvas></div>

        <div class="panel-header" style="margin-top:18px;"><h3 style="font-size:14px;">Lista de Funcionários — Quadro Atual</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Código</th><th>Funcionário</th><th>Status</th></tr></thead>
            <tbody>
              ${listaAtual.map(r=>`<tr>
                <td>${r.codigo||'-'}</td>
                <td>${escapeHtml(registry.get(r.codKey)||r.nome)}</td>
                <td><span style="color:${statusColor[r.bucket]};font-weight:700;">${r.statusRaw||statusLabel[r.bucket]}</span></td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===== BLOCO 2: HISTÓRICO FILTRADO ===== -->
    <div class="panel">
      <div class="panel-header" style="flex-direction:column;align-items:flex-start;gap:10px;">
        <h3>Histórico de Presença</h3>
        <div class="toolbar" style="padding:0;border:none;background:none;box-shadow:none;margin:0;">
          <div class="filter-group"><label>Data Inicial</label><input type="date" id="cham-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}"></div>
          <div class="filter-group"><label>Data Final</label><input type="date" id="cham-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}"></div>
          <button class="btn btn-outline btn-sm" id="cham-clear">Limpar</button>
        </div>
      </div>

      ${histMin?`<div class="hint-box">📅 Exibindo: <strong>${fmtDateBR(histMin)}</strong> até <strong>${fmtDateBR(histMax)}</strong> — ${histRows.length} registros</div>`:''}

      <div class="cards-grid cards-2">
        <div class="card tip-card ${s.presencaPct>=90?'pos':s.presencaPct<80?'neg':'warn'}" tabindex="0" data-tip="${escapeHtml(tipQtds)}">
          <div class="card-label">% Presença do Período</div>
          <div class="card-value ${s.presencaPct>=90?'pos':s.presencaPct<80?'neg':'warn'}">${s.presencaPct!==null?fmtNum(s.presencaPct,1)+'%':'-'}</div>
          <div class="card-sub">(Pres. + Seg.Turno) ÷ (Pres. + Seg.Turno + Falta)</div>
          <div class="tip-hint">passe o mouse para ver as quantidades</div>
        </div>
        <div class="card warn tip-card" tabindex="0" data-tip="${escapeHtml(tipQtds)}">
          <div class="card-label">Absenteísmo</div>
          <div class="card-value warn">${s.absenteismo!==null?fmtNum(s.absenteismo,1)+'%':'-'}</div>
          <div class="card-sub">Faltas ÷ (Pres. + Seg.Turno + Falta)</div>
          <div class="tip-hint">passe o mouse para ver as quantidades</div>
        </div>
      </div>

      <div class="panel" style="margin-top:14px;margin-bottom:0;">
        <div class="panel-header"><h3>Status (Período)</h3></div>
        <div class="chart-wrap" style="max-width:520px;margin:0 auto;"><canvas id="chart-status-hist"></canvas></div>
      </div>
      <div class="panel" style="margin-top:14px;margin-bottom:0;">
        <div class="panel-header"><h3>Presença Mês a Mês</h3><span class="small-muted">todos os meses — não muda com o filtro de datas</span></div>
        <div class="chart-wrap"><canvas id="chart-presenca-mes"></canvas></div>
        <div class="cards-grid cards-meses" style="margin-top:14px;">
          ${byMonth.map(m=>{
            const cls = m.presencaPct===null?'':(m.presencaPct>=90?'pos':m.presencaPct<80?'neg':'warn');
            const linha = (cor,nome,v)=>`<div class="tip-l"><span class="tip-d" style="background:${cor}"></span><span>${nome}</span><b>${fmtNum(v)}</b></div>`;
            const tip = `<div class="tip-t">${m.label}${m.emAndamento?' · em andamento':''}</div>` + linha("#1a9c62","Presentes",m.PRESENTE) + linha("#5b9bd5","Seg. Turno",m.SEGUNDO_TURNO) + linha("#d64545","Faltas",m.FALTA) + linha("#8a97a8","Folgas",m.FOLGA) + linha("#9c6ade","Férias",m.FERIAS) + linha("#e08a1f","Atestados",m.ATESTADO);
            return `<div class="card tip-card ${cls}" tabindex="0" data-tip="${escapeHtml(tip)}">
              <div class="card-label">${m.label}${m.emAndamento?' <span class="tag-neutral" style="margin-left:4px;">em andamento</span>':''}</div>
              <div class="card-value ${cls}">${m.presencaPct!==null?fmtNum(m.presencaPct,1)+'%':'-'}</div>
              <div class="card-sub">Absenteísmo ${m.absenteismoPct!==null?fmtNum(m.absenteismoPct,1)+'%':'-'}</div>
            </div>`; }).join("") || '<div class="small-muted">Sem registros de chamada.</div>'}
        </div>
      </div>

      <!-- 3 tabelas de ranking -->
      <div class="grid-3" style="margin-top:14px;">
        <div class="panel" style="margin-bottom:0;">
          <div class="panel-header"><h3>Ranking Faltantes</h3></div>
          <div class="table-wrap" style="max-height:280px;overflow-y:auto;">
            <table class="data-table">
              <thead><tr><th>Código</th><th>Funcionário</th><th>Faltas</th></tr></thead>
              <tbody>${faltantes.map(f=>`<tr class="clickable" onclick="showEmployeeSummary('${f.codKey}')"><td>${f.codKey.replace('NOME::','')!==f.codKey?'-':f.codKey}</td><td>${escapeHtml(f.nome)}</td><td class="cell-neg">${f.faltas}</td></tr>`).join("") || '<tr><td colspan="3" class="small-muted">Sem faltas.</td></tr>'}</tbody>
            </table>
          </div>
        </div>
        <div class="panel" style="margin-bottom:0;">
          <div class="panel-header"><h3>Ranking Seg. Turno</h3></div>
          <div class="table-wrap" style="max-height:280px;overflow-y:auto;">
            <table class="data-table">
              <thead><tr><th>Código</th><th>Funcionário</th><th>Qtd</th></tr></thead>
              <tbody>${segTurno.map(f=>`<tr class="clickable" onclick="showEmployeeSummary('${f.codKey}')"><td>${f.cod||'-'}</td><td>${escapeHtml(f.nome)}</td><td>${f.qtd}</td></tr>`).join("") || '<tr><td colspan="3" class="small-muted">Sem registros.</td></tr>'}</tbody>
            </table>
          </div>
        </div>
        <div class="panel" style="margin-bottom:0;">
          <div class="panel-header"><h3>Ranking Atestados</h3></div>
          <div class="table-wrap" style="max-height:280px;overflow-y:auto;">
            <table class="data-table">
              <thead><tr><th>Código</th><th>Funcionário</th><th>Qtd</th></tr></thead>
              <tbody>${atestados.map(f=>`<tr class="clickable" onclick="showEmployeeSummary('${f.codKey}')"><td>${f.cod||'-'}</td><td>${escapeHtml(f.nome)}</td><td class="cell-warn">${f.qtd}</td></tr>`).join("") || '<tr><td colspan="3" class="small-muted">Sem atestados.</td></tr>'}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // listeners dos filtros (dentro do painel de histórico)
  $("#cham-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderChamada(); });
  $("#cham-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderChamada(); });
  $("#cham-clear").addEventListener("click", ()=>{ Attendance.state = {dataInicial:null,dataFinal:null}; renderChamada(); });

  $("#btn-export-quadroatual-pdf").addEventListener("click", async ()=>{
    const container = buildQuadroAtualReportContainer(quadroAtualRows, scounts, maxDate, registry);
    try{
      await Export.toPDFSinglePage(container, "quadro-atual-presenca", "portrait");
    } finally {
      if(container.parentNode) container.parentNode.removeChild(container);
    }
  });
  $("#btn-export-quadroatual-png").addEventListener("click", async ()=>{
    const container = buildQuadroAtualReportContainer(quadroAtualRows, scounts, maxDate, registry);
    try{
      await Export.toPNG(container, "quadro-atual-presenca");
    } finally {
      if(container.parentNode) container.parentNode.removeChild(container);
    }
  });

  // Gráfico pizza estático
  Charts.make("chart-status-atual", {
    type:"doughnut",
    data:{ labels:["Presente","Seg. Turno","Falta","Folga","Férias","Atestado"],
      datasets:[{ data:[scounts.PRESENTE,scounts.SEGUNDO_TURNO,scounts.FALTA,scounts.FOLGA,scounts.FERIAS,scounts.ATESTADO],
        backgroundColor:[Charts.colors.green,"#5b9bd5",Charts.colors.red,Charts.colors.gray,"#9c6ade",Charts.colors.orange] }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"bottom", labels:{font:{size:11}} },
      datalabels:{ display:(ctx)=> ctx.dataset.data[ctx.dataIndex]>0, color:"#fff", font:{size:12,weight:"700"},
        formatter:(value)=> value>0?fmtNum(value):"" } } }
  });

  // Gráfico pizza histórico
  Charts.make("chart-status-hist", {
    type:"doughnut",
    data:{ labels:["Presente","Seg. Turno","Falta","Folga","Férias","Atestado"],
      datasets:[{ data:[s.counts.PRESENTE,s.counts.SEGUNDO_TURNO,s.counts.FALTA,s.counts.FOLGA,s.counts.FERIAS,s.counts.ATESTADO],
        backgroundColor:[Charts.colors.green,"#5b9bd5",Charts.colors.red,Charts.colors.gray,"#9c6ade",Charts.colors.orange] }] },
    options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"bottom", labels:{font:{size:11}} },
      datalabels:{ display:(ctx)=> ctx.dataset.data[ctx.dataIndex]>0, color:"#fff", font:{size:12,weight:"700"},
        formatter:(value)=> value>0?fmtNum(value):"" } } }
  });

  // Gráfico mês a mês: linhas de % (presença e absenteísmo); as quantidades aparecem só ao passar o mouse
  const pctMin = byMonth.length ? Math.max(0, Math.floor(Math.min(...byMonth.map(m=>m.presencaPct==null?100:m.presencaPct)) / 5) * 5 - 5) : 0;
  Charts.make("chart-presenca-mes", {
    type:"line",
    data:{ labels: byMonth.map(m=>m.label), datasets:[
      { label:"% Presença", data: byMonth.map(m=>m.presencaPct), borderColor:Charts.colors.green, backgroundColor:"rgba(26,156,98,.12)", fill:true, tension:.3, pointRadius:5, pointHoverRadius:7, yAxisID:"pct",
        datalabels:{ display:true, align:"top", anchor:"end", color:Charts.colors.green, font:{size:11,weight:"700"}, formatter:v=> v==null ? "" : fmtNum(v,1)+"%" } },
      { label:"% Absenteísmo", data: byMonth.map(m=>m.absenteismoPct), borderColor:Charts.colors.red, backgroundColor:Charts.colors.red, borderDash:[5,4], tension:.3, pointRadius:4, pointHoverRadius:6, yAxisID:"abs",
        datalabels:{ display:true, align:"bottom", anchor:"start", color:Charts.colors.red, font:{size:11,weight:"700"}, formatter:v=> v==null ? "" : fmtNum(v,1)+"%" } }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:18, bottom:6, left:4, right:8 } },
      interaction:{ mode:"index", intersect:false },
      plugins:{ legend:{ labels:{font:{size:11}} },
        tooltip:{ callbacks:{
          label:(c)=> c.dataset.label + ": " + (c.parsed.y==null ? "-" : fmtNum(c.parsed.y,1)+"%"),
          afterBody:(items)=>{ const m = byMonth[items[0].dataIndex]; if(!m) return [];
            return ["", `Presentes: ${fmtNum(m.PRESENTE)}`, `Seg. Turno: ${fmtNum(m.SEGUNDO_TURNO)}`, `Faltas: ${fmtNum(m.FALTA)}`, `Folgas: ${fmtNum(m.FOLGA)}`, `Férias: ${fmtNum(m.FERIAS)}`, `Atestados: ${fmtNum(m.ATESTADO)}`]; } } } },
      scales:{
        pct:{ type:"linear", position:"left", min:pctMin, max:100, grid:{color:"rgba(128,140,160,.18)"}, ticks:{ callback:v=>v+"%", color:Charts.colors.green } },
        abs:{ type:"linear", position:"right", min:0, suggestedMax:20, grid:{display:false}, ticks:{ callback:v=>v+"%", color:Charts.colors.red } },
        x:{ grid:{display:false} }
      }
    }
  });
}

/* ---------------------------------------------------------------------- */
/* RENDER: Auditoria (fonte online — Google Sheets)                        */
/* ---------------------------------------------------------------------- */
function renderAuditoria(){
  const pane = $("#pane-auditoria");
  const st = AuditOnline.state;

  if(AuditOnline.rows===null && !AuditOnline.loading){
    AuditOnline.load().then(()=> renderAuditoria());
  }

  const statusBadge = AuditOnline.loading
    ? `<span style="background:#e08a1f22;color:#e08a1f;font-size:10px;font-weight:800;padding:3px 10px;border-radius:10px;">ATUALIZANDO...</span>`
    : (AuditOnline.error && !(AuditOnline.rows&&AuditOnline.rows.length))
      ? `<span style="background:#d6454522;color:#d64545;font-size:10px;font-weight:800;padding:3px 10px;border-radius:10px;">ERRO DE CONEXAO</span>`
      : `<span style="background:#1a9c6222;color:#1a9c62;font-size:10px;font-weight:800;padding:3px 10px;border-radius:10px;">\u25CF DADOS ONLINE</span>`;

  if(AuditOnline.loading){
    pane.innerHTML = `<div class="hint-box">${statusBadge} Carregando dados da planilha online...</div>`;
    return;
  }
  if(AuditOnline.error && !(AuditOnline.rows && AuditOnline.rows.length)){
    pane.innerHTML = `<div class="warn-box">${statusBadge}<br><br>Nao foi possivel atualizar os dados da Auditoria. Verifique a conexao ou a disponibilidade da planilha online.<br><strong>${escapeHtml(AuditOnline.error)}</strong><br>
      Confira se o link do Google Sheets esta compartilhado como "Qualquer pessoa com o link pode visualizar".
      <div style="margin-top:10px;"><button class="btn btn-outline btn-sm" id="aud-retry">Tentar novamente</button></div></div>`;
    $("#aud-retry").addEventListener("click", ()=>{ AuditOnline.load(true).then(()=>renderAuditoria()); });
    return;
  }

  const allRuas = uniq((AuditOnline.rows||[]).map(r=>r.rua)).sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));
  const registry = window.APP_STATE.nameRegistry;
  const allReps = uniq((AuditOnline.rows||[]).filter(r=>r.codKey).map(r=>r.codKey))
    .map(c=>({codKey:c, nome:registry.get(c)||c})).sort((a,b)=>a.nome.localeCompare(b.nome));
  const allAuditores = uniq((AuditOnline.rows||[]).filter(r=>r.auditor).map(r=>r.auditor)).sort();

  const lastSync = AuditOnline.lastLoadedAt ? `Ultima atualizacao: ${fmtDateBR(AuditOnline.lastLoadedAt)} ${AuditOnline.lastLoadedAt.toLocaleTimeString('pt-BR')}` : '';

  pane.innerHTML = `
    <div class="toolbar" style="margin-bottom:6px;">
      <div class="filter-group"><label>Atalhos de Periodo</label>
        <div>${renderAtalhos(st.atalhoSel, 'atalhoAuditoria', ['mes_atual','mes_ant','ultimos_3m','ano_atual','ano_ant','ultimos_30','ultimos_90','tudo'])}</div>
      </div>
      <div class="filter-group">
        <label>Somente Quadro Atual?</label>
        <div class="toggle-group" id="aud-quadro-toggle">
          <button data-v="SIM" class="${st.apenasQuadroAtual==='SIM'?'active':''}">Sim</button>
          <button data-v="NAO" class="${st.apenasQuadroAtual==='NAO'?'active':''}">Nao</button>
        </div>
      </div>
      <div class="spacer"></div>
      ${statusBadge}
      <span class="small-muted" style="white-space:nowrap;">${lastSync}</span>
      <button class="btn btn-outline btn-sm" id="aud-refresh">\u21BB Atualizar dados</button>
    </div>
    <div class="toolbar">
      <div class="filter-group"><label>Data Inicial</label><input type="date" id="aud-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}"></div>
      <div class="filter-group"><label>Data Final</label><input type="date" id="aud-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}"></div>
      <div class="filter-group"><label>Rua</label><select id="aud-rua"><option value="">Todas</option>${allRuas.map(r=>`<option value="${escapeHtml(r)}" ${String(st.rua)===String(r)?'selected':''}>Rua ${escapeHtml(r)}</option>`).join("")}</select></div>
      <div class="filter-group"><label>Repositor</label><select id="aud-rep"><option value="">Todos</option>${allReps.map(r=>`<option value="${r.codKey}" ${st.repositor===r.codKey?'selected':''}>${escapeHtml(r.nome)}</option>`).join("")}</select></div>
      <div class="filter-group"><label>Auditor</label><select id="aud-auditor"><option value="">Todos</option>${allAuditores.map(a=>`<option value="${escapeHtml(a)}" ${st.auditor===a?'selected':''}>${escapeHtml(a)}</option>`).join("")}</select></div>
      <div class="spacer"></div>
      <button class="btn btn-outline btn-sm" id="aud-clear">Limpar filtros</button>
    </div>
    <div id="aud-topo"></div>
    <div class="aud-sec aud-sec-ret"><strong>🔁 Auditoria de Retornos</strong><span>fonte: Auditoria_Retorno + Rotina_Retorno + Quadro_Repositores</span></div>
    <div id="aud-retornos"></div>
    <div class="aud-sec aud-sec-rua"><strong>📍 Auditoria de Ruas</strong><span>fonte: Auditoria_Ruas · % de qualidade por rua e por repositor</span></div>
    <div id="aud-content"></div>
  `;
  if(typeof RetornoQ!=="undefined") RetornoQ.render();
  $("#aud-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; st.atalhoSel=null; renderAuditoria(); });
  $("#aud-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; st.atalhoSel=null; renderAuditoria(); });
  $("#aud-rua").addEventListener("change", e=>{ st.rua = e.target.value||null; renderAuditoria(); });
  $("#aud-rep").addEventListener("change", e=>{ st.repositor = e.target.value||null; renderAuditoria(); });
  $("#aud-auditor").addEventListener("change", e=>{ st.auditor = e.target.value||null; renderAuditoria(); });
  $("#aud-clear").addEventListener("click", ()=>{ AuditOnline.state = {dataInicial:null,dataFinal:null,atalhoSel:null,rua:null,repositor:null,auditor:null,apenasQuadroAtual:"SIM"}; renderAuditoria(); });
  $("#aud-refresh").addEventListener("click", ()=>{ AuditOnline.load(true).then(()=>renderAuditoria()); });
  $("#aud-quadro-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    st.apenasQuadroAtual = b.dataset.v; renderAuditoria();
  });

  const cards = AuditOnline.cards();
  const fmtQual = (v) => v!==null ? fmtNum(v,1)+'%' : '-';
  const qualClass = (v) => { const s=auditoriaStatusQual(v); return s.label==='Excelente'||s.label==='Boa'?'pos':s.label==='Atencao'||s.label==='Atenção'?'warn':s.label==='Critica'||s.label==='Crítica'?'neg':''; };

  const rows = AuditOnline.getRows();
  const audDates = rows.map(r=>r.data).filter(Boolean);
  const audMin = audDates.length ? new Date(Math.min(...audDates.map(d=>d.getTime()))) : null;
  const audMax = audDates.length ? new Date(Math.max(...audDates.map(d=>d.getTime()))) : null;
  const audBadge = audMin ? `<div class="hint-box">Exibindo: <strong>${fmtDateBR(audMin)}</strong> ate <strong>${fmtDateBR(audMax)}</strong> - ${rows.length} auditoria(s)${st.rua?' - Rua '+escapeHtml(st.rua):''}${st.repositor?' - '+escapeHtml(registry.get(st.repositor)||st.repositor):''}${st.auditor?' - Auditor '+escapeHtml(st.auditor):''}${st.apenasQuadroAtual==='SIM'?' - so quadro atual':''}</div>` : "";

  if(!rows.length){
    $("#aud-content").innerHTML = audBadge + `<div class="warn-box">Nenhuma auditoria encontrada para os filtros selecionados.</div>
      <div class="cards-grid">
        <div class="card ${qualClass(cards.qualMesAtual)}"><div class="card-label">% Qualidade - Mes Atual</div><div class="card-value ${qualClass(cards.qualMesAtual)}">${fmtQual(cards.qualMesAtual)}</div></div>
        <div class="card ${qualClass(cards.qualMesAnterior)}"><div class="card-label">% Qualidade - Mes Anterior</div><div class="card-value ${qualClass(cards.qualMesAnterior)}">${fmtQual(cards.qualMesAnterior)}</div></div>
        <div class="card ${qualClass(cards.qualUlt3Meses)}"><div class="card-label">% Qualidade - Ultimos 3 Meses</div><div class="card-value ${qualClass(cards.qualUlt3Meses)}">${fmtQual(cards.qualUlt3Meses)}</div></div>
      </div>`;
    return;
  }

  const byRep = AuditOnline.byRepositor();
  const byRua = AuditOnline.byRua();
  const byAuditor = AuditOnline.byAuditor();
  const byRepRua = AuditOnline.byRepositorRua();
  const evolucao = AuditOnline.evolucao();
  const porTipo = AuditOnline.ocorrenciasPorTipo();

  $("#aud-content").innerHTML = audBadge + `
    <div class="panel-header" style="margin:14px 0 8px;"><h3>Qualidade por Periodo (calendario - independe do filtro de Ciclo)</h3></div>
    <div class="cards-grid">
      <div class="card ${qualClass(cards.qualMesAtual)}"><div class="card-label">% Qualidade - Mes Atual</div><div class="card-value ${qualClass(cards.qualMesAtual)}">${fmtQual(cards.qualMesAtual)}</div></div>
      <div class="card ${qualClass(cards.qualMesAnterior)}"><div class="card-label">% Qualidade - Mes Anterior</div><div class="card-value ${qualClass(cards.qualMesAnterior)}">${fmtQual(cards.qualMesAnterior)}</div></div>
      <div class="card ${qualClass(cards.qualUlt3Meses)}"><div class="card-label">% Qualidade - Ultimos 3 Meses</div><div class="card-value ${qualClass(cards.qualUlt3Meses)}">${fmtQual(cards.qualUlt3Meses)}</div></div>
    </div>

    <div class="panel-header" style="margin:14px 0 8px;"><h3>Periodo Selecionado</h3></div>
    <div class="hint-box">Qualidade de uma auditoria = (Itens cadastrados na 8022 da rua − penalidade) / Itens, onde penalidade = Avariados×4 + Prox.Vencimento×3 + Picking Errado×6 + Sem Saldo×2. Ex.: rua com 100 itens e 1 avaria = (100−4)/100 = 96%. Sem itens conhecidos na 8022, usa a nota por critério (peso OK / 15 × 100). Qualidade do grupo = media das auditorias.</div>
    <div class="cards-grid">
      <div class="card"><div class="card-label">Auditorias no Periodo</div><div class="card-value">${fmtNum(cards.auditoriasRealizadas)}</div></div>
      <div class="card ${qualClass(cards.qualidadeMedia)}"><div class="card-label">Qualidade Geral</div><div class="card-value ${qualClass(cards.qualidadeMedia)}">${fmtQual(cards.qualidadeMedia)}</div></div>
      <div class="card"><div class="card-label">Auditorias com Problema</div><div class="card-value neg">${fmtNum(cards.auditoriasComProblema)}</div></div>
      <div class="card"><div class="card-label">Ruas Auditadas</div><div class="card-value">${fmtNum(cards.ruasAuditadas)}</div></div>
      <div class="card"><div class="card-label">Ruas Criticas (&lt;80%)</div><div class="card-value neg">${fmtNum(cards.ruasCriticas)}</div></div>
      <div class="card"><div class="card-label">Auditores Ativos</div><div class="card-value">${fmtNum(cards.auditoresAtivos)}</div></div>
    </div>

    <div class="panel-header" style="margin:14px 0 8px;"><h3>Indicadores de Ocorrencias</h3></div>
    <div class="cards-grid">
      <div class="card"><div class="card-label">Picking Errado</div><div class="card-value">${fmtNum(cards.totalPickErrado)}</div></div>
      <div class="card"><div class="card-label">Avariados</div><div class="card-value">${fmtNum(cards.totalAvariado)}</div></div>
      <div class="card"><div class="card-label">Prox. Vencimento</div><div class="card-value">${fmtNum(cards.totalProxVenc)}</div></div>
      <div class="card"><div class="card-label">Sem Saldo</div><div class="card-value">${fmtNum(cards.totalSemSaldo)}</div></div>
      <div class="card"><div class="card-label">Total Geral de Problemas</div><div class="card-value neg">${fmtNum(cards.totalOcorrencias)}</div></div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h3>Qualidade por Repositor</h3></div>
        <div class="chart-wrap tall"><canvas id="chart-qual-rep"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Qualidade por Rua</h3></div>
        <div class="chart-wrap tall"><canvas id="chart-qual-rua"></canvas></div>
      </div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h3>Evolucao da Qualidade</h3></div>
        <div class="chart-wrap"><canvas id="chart-qual-evo"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Problemas por Tipo</h3></div>
        <div class="chart-wrap"><canvas id="chart-tipo"></canvas></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header"><h3>Ocorrencias por Dia</h3></div>
      <div class="chart-wrap"><canvas id="chart-ocor-dia"></canvas></div>
    </div>

    ${byAuditor.length ? `
    <div class="panel">
      <div class="panel-header"><h3>Auditores</h3></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Auditor</th><th>Auditorias</th><th>Ruas Auditadas</th><th>Problemas</th><th>Qualidade Media</th></tr></thead>
        <tbody>${byAuditor.map(e=>`<tr><td>${escapeHtml(e.auditor)}</td><td>${e.auditorias}</td><td>${e.ruas}</td><td class="cell-neg">${e.ocorrencias}</td><td class="${qualClass(e.qualidadeMedia)}">${fmtQual(e.qualidadeMedia)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>` : ``}

    <div class="panel">
      <div class="panel-header"><h3>Qualidade por Repositor</h3></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Codigo</th><th>Repositor</th><th>Auditorias</th><th>Pick. Errado</th><th>Avariados</th><th>Prox. Venc.</th><th>Sem Saldo</th><th>Problemas</th><th>Qualidade %</th></tr></thead>
        <tbody>${byRep.map(e=>`<tr><td>${e.cod||'-'}</td><td>${escapeHtml(e.nome)}</td><td>${e.auditorias}</td><td>${e.pickErrado}</td><td>${e.avariado}</td><td>${e.proxVenc}</td><td>${e.semSaldo}</td><td class="cell-neg">${e.ocorrencias}</td><td class="${qualClass(e.qualidadeMedia)}">${fmtQual(e.qualidadeMedia)}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Qualidade por Rua - Repositor e Rua</h3>
        <span class="panel-note">Qualidade = (Itens da 8022 − penalidade) / Itens · penalidade = Avaria×4 + Prox.Venc×3 + Picking×6 + SemSaldo×2</span>
      </div>
      <div class="table-wrap" style="max-height:400px;overflow-y:auto;"><table class="data-table">
        <thead><tr><th>Repositor</th><th>Codigo</th><th>Rua</th><th>Itens (8022)</th><th>Auditorias</th><th>Pick. Errado</th><th>Avariados</th><th>Prox. Venc.</th><th>Sem Saldo</th><th>Problemas</th><th>Qualidade</th><th>Status</th></tr></thead>
        <tbody>${byRepRua.map(e=>{ const s=auditoriaStatusQual(e.qualidadeMedia); return `<tr><td>${escapeHtml(e.nome)}</td><td>${e.cod||'-'}</td><td>Rua ${escapeHtml(String(e.rua))}</td><td>${e.itens8022>0?fmtNum(e.itens8022):'-'}</td><td>${e.auditorias}</td><td>${e.pickErrado}</td><td>${e.avariado}</td><td>${e.proxVenc}</td><td>${e.semSaldo}</td><td class="cell-neg">${e.ocorrencias}</td><td class="${qualClass(e.qualidadeMedia)}">${fmtQual(e.qualidadeMedia)}</td><td><span style="color:${s.cor};font-weight:700;">${s.label}</span></td></tr>`; }).join("")}</tbody>
      </table></div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Qualidade por Rua - Resumo</h3>
        <span class="panel-note">Qualidade = (Itens da 8022 − penalidade) / Itens · penalidade = Avaria×4 + Prox.Venc×3 + Picking×6 + SemSaldo×2</span>
      </div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Rua</th><th>Itens (8022)</th><th>Auditorias</th><th>Problemas</th><th>Qualidade Media</th><th>Status</th></tr></thead>
        <tbody>${byRua.map(e=>{ const s=auditoriaStatusQual(e.qualidadeMedia); return `<tr><td>Rua ${escapeHtml(String(e.rua))}</td><td>${e.itens8022>0?fmtNum(e.itens8022):'-'}</td><td>${e.auditorias}</td><td class="cell-neg">${e.ocorrencias}</td><td class="${qualClass(e.qualidadeMedia)}">${fmtQual(e.qualidadeMedia)}</td><td><span style="color:${s.cor};font-weight:700;">${s.label}</span></td></tr>`; }).join("")}</tbody>
      </table></div>
    </div>


    <div class="panel">
      <div class="panel-header"><h3>Detalhamento das Auditorias</h3></div>
      <div class="table-wrap" style="max-height:340px;overflow-y:auto;"><table class="data-table">
        <thead><tr><th>Data</th><th>Rua</th><th>Codigo</th><th>Repositor</th><th>Auditor</th><th>Pick. Errado</th><th>Avariados</th><th>Prox. Venc.</th><th>Sem Saldo</th><th>Status</th></tr></thead>
        <tbody>${rows.map(r=>`<tr class="clickable" onclick='showAuditDetailOnline(${r._row})'><td>${fmtDateBR(r.data)}</td><td>${escapeHtml(String(r.rua))}</td><td>${r.cod||'-'}</td><td>${escapeHtml(r.nome||'-')}</td><td>${escapeHtml(r.auditor||'-')}</td>
          <td class="cell-neg">${r.pickErrado}</td><td class="cell-neg">${r.avariado}</td><td class="cell-neg">${r.proxVenc}</td><td class="cell-neg">${r.semSaldo}</td><td class="${r.impecavel?'cell-pos':'cell-neg'}">${r.impecavel?'Impecavel':'Com ocorrencia'}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>
  `;

  Charts.make("chart-qual-rep", {
    type:"bar",
    data:{ labels: byRep.map(e=>e.nome), datasets:[{ label:"Qualidade %", data: byRep.map(e=>e.qualidadeMedia), backgroundColor:Charts.colors.blue, borderRadius:4 }] },
    options: Charts.baseOptions({ indexAxis:"y", scales:{ x:{ min:0,max:100, grid:{color:"#eaeef3"} }, y:{grid:{display:false}} } })
  });
  Charts.make("chart-qual-rua", {
    type:"bar",
    data:{ labels: byRua.map(e=>"Rua "+e.rua), datasets:[{ label:"Qualidade %", data: byRua.map(e=>e.qualidadeMedia), backgroundColor:Charts.colors.orange, borderRadius:4 }] },
    options: Charts.baseOptions({ scales:{ y:{min:0,max:100} } })
  });
  Charts.make("chart-qual-evo", {
    type:"line",
    data:{ labels: evolucao.map(e=>fmtDateBR(e.date)), datasets:[{ label:"Qualidade %", data: evolucao.map(e=>e.qualidadeMedia), borderColor:Charts.colors.green, backgroundColor:"rgba(26,156,98,.12)", fill:true, tension:.3 }] },
    options: Charts.baseOptions({ plugins:{legend:{display:false}}, scales:{ y:{min:0,max:100} } })
  });
  Charts.make("chart-tipo", {
    type:"bar",
    data:{ labels: porTipo.map(s=>s.tipo), datasets:[{ label:"Ocorrencias", data: porTipo.map(s=>s.total), backgroundColor:Charts.colors.red, borderRadius:4 }] },
    options: Charts.baseOptions({ indexAxis:"y" })
  });
  Charts.make("chart-ocor-dia", {
    type:"bar",
    data:{ labels: evolucao.map(e=>fmtDateBR(e.date)), datasets:[{ label:"Problemas", data: evolucao.map(e=>{
      const dr = rows.filter(r=>ymdKey(r.data)===ymdKey(e.date));
      return sum(dr.map(r=>r.totalOcorrencias));
    }), backgroundColor:Charts.colors.blueDark, borderRadius:4 }] },
    options: Charts.baseOptions({ plugins:{legend:{display:false}} })
  });
}

function atalhoAuditoria(tipo){
  const {ini,fim}=periodoAtalho(tipo);
  AuditOnline.state.dataInicial=ini; AuditOnline.state.dataFinal=fim; AuditOnline.state.atalhoSel=tipo;
  renderAuditoria();
}

function showAuditDetailOnline(rowIdx){
  const r = (AuditOnline.rows||[]).find(x=>x._row===rowIdx);
  if(!r) return;
  const temFoto = r.possuiImagem && (r.foto || r.foto2);
  const linkFoto = (url, label) => {
    if(!url) return '';
    const isUrl = /^https?:\/\//i.test(url);
    return isUrl
      ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="margin-right:6px;">${label}</a>`
      : `<span class="small-muted" style="margin-right:10px;">${label}: ${escapeHtml(url)}</span>`;
  };
  UI.openModal(`
    <h3>Auditoria - Rua ${escapeHtml(String(r.rua))}</h3>
    <p><strong>Data:</strong> ${fmtDateBR(r.data)} &nbsp; <strong>Codigo:</strong> ${r.cod||'-'} &nbsp; <strong>Repositor:</strong> ${escapeHtml(r.nome||'-')} &nbsp; <strong>Auditor:</strong> ${escapeHtml(r.auditor||'-')}</p>
    <p><strong>Status:</strong> ${r.impecavel?'Impecavel (sem ocorrencias)':'Com ocorrencia(s)'} &nbsp; <strong>Qualidade:</strong> ${fmtNum(r.qualidade,1)}%</p>
    <ul class="criteria-list">
      <li><span>Picking Errado</span><span class="${r.pickErrado>0?'badge-nao':'badge-sim'}">${r.pickErrado}</span></li>
      <li><span>Avariados</span><span class="${r.avariado>0?'badge-nao':'badge-sim'}">${r.avariado}</span></li>
      <li><span>Prox. Vencimento</span><span class="${r.proxVenc>0?'badge-nao':'badge-sim'}">${r.proxVenc}</span></li>
      <li><span>Sem Saldo</span><span class="${r.semSaldo>0?'badge-nao':'badge-sim'}">${r.semSaldo}</span></li>
    </ul>
    <p class="small-muted">Produtos auditados na rua neste dia (por este repositor): <strong>${r.produtosAuditados||0}</strong></p>
    ${(r.itens&&r.itens.length) ? `<div class="table-wrap" style="max-height:220px;overflow-y:auto;"><table class="data-table"><thead><tr><th>Produto</th><th>Descrição</th><th>Endereço</th><th>Ocorrência</th></tr></thead><tbody>${r.itens.map(i=>`<tr><td>${escapeHtml(i.produto)}</td><td>${escapeHtml(i.desc)}</td><td>${escapeHtml(i.endereco)}</td><td>${escapeHtml(i.tipos)}</td></tr>`).join("")}</tbody></table></div>` : ''}
    <div style="margin-top:10px;">
      ${temFoto ? (linkFoto(r.foto,'Ver evidencia 1')+linkFoto(r.foto2,'Ver evidencia 2')) : '<span class="small-muted">Sem imagem</span>'}
    </div>
  `);
}

function showAuditLegend(){
  UI.openModal(`
    <h3>Como funciona a Qualidade da Auditoria</h3>
    <p class="small-muted">Cada auditoria possui 7 critérios avaliados como <strong>Realizado</strong> ou <strong>Não Realizado</strong>.</p>
    <div class="legend-line"><span class="dot sim"></span> ✅ Realizado = critério atendido corretamente</div>
    <div class="legend-line"><span class="dot nao"></span> ❌ Não Realizado = critério não atendido</div>
    <table class="legend-table">
      <tr><td>7 Realizados</td><td><strong>100%</strong></td></tr>
      <tr><td>6 Realizados</td><td><strong>85,71%</strong></td></tr>
      <tr><td>5 Realizados</td><td><strong>71,43%</strong></td></tr>
      <tr><td>4 Realizados</td><td><strong>57,14%</strong></td></tr>
      <tr><td>3 Realizados</td><td><strong>42,86%</strong></td></tr>
      <tr><td>2 Realizados</td><td><strong>28,57%</strong></td></tr>
      <tr><td>1 Realizado</td><td><strong>14,29%</strong></td></tr>
      <tr><td>0 Realizados</td><td><strong>0%</strong></td></tr>
    </table>
    <p class="small-muted" style="margin-top:10px;">Fórmula: Qualidade % = Realizados ÷ 7 × 100</p>
  `);
}

/* ---------------------------------------------------------------------- */
/* RENDER: Comissão                                                        */
/* ---------------------------------------------------------------------- */
let commissionQuadroAtual = "SIM"; // começa filtrado pelo quadro atual
let commissionOnlyRepositor = true; // filtro "apenas Cargo = REPOSITOR" — inicia SIM
let commissionConsiderarMissoes = "SIM"; // se missões entram no cálculo de Pontos/Comissão Total
let commissionShowMissoes = false; // visibilidade da coluna Missões (começa oculta)
let commissionShowValorPonto = true; // visibilidade da coluna Valor/Ponto
let commissionShowComissaoTotal = true; // visibilidade da coluna Comissão Total
let commissionShowRegra = false; // visibilidade da coluna Regra (começa oculta)
let commissionAplicarDesconto = "SIM"; // se o desconto por % Qualidade é aplicado na Comissão Total exibida/exportada
const CommissionState = { dataInicial: null, dataFinal: null, padraoAplicado: false };

function renderComissao(){
  const pane = $("#pane-comissao");
  const cfg = window.APP_STATE.commissionConfig;
  const currentTeam = window.APP_STATE.currentTeam;
  const st = CommissionState;
  // abre já filtrado pelo mês atual (só na primeira vez; "Tudo" ou datas manuais depois valem)
  if(!st.padraoAplicado){ const p = periodoAtalho('mes_atual'); st.dataInicial = p.ini; st.dataFinal = p.fim; st.padraoAplicado = true; }

  // % Qualidade (coluna + modelo por qualidade) vem do AuditOnline (Gestão > Auditoria) —
  // carrega em background se ainda não tiver sido carregado nesta sessão.
  if(AuditOnline.rows===null && !AuditOnline.loading){
    AuditOnline.load().then(()=> renderCommissionTable());
  }

  const badgePeriodo = (st.dataInicial || st.dataFinal)
    ? `<span class="hint-box" style="margin:0;padding:6px 12px;">📅 <strong>${st.dataInicial?fmtDateBR(st.dataInicial):'início'}</strong> até <strong>${st.dataFinal?fmtDateBR(st.dataFinal):'hoje'}</strong></span>`
    : `<span class="hint-box" style="margin:0;padding:6px 12px;">📊 Todo o histórico de produção</span>`;

  pane.innerHTML = `
    <div class="toolbar" style="margin-bottom:14px;">
      <div class="filter-group">
        <label>Apenas Quadro Atual?</label>
        <div class="toggle-group" id="comm-quadro-toggle">
          <button data-v="SIM" class="${commissionQuadroAtual==='SIM'?'active':''}">Sim</button>
          <button data-v="NAO" class="${commissionQuadroAtual==='NAO'?'active':''}">Não</button>
        </div>
      </div>
      <div class="filter-group"><label>Data Inicial</label><input type="date" id="comm-data-ini" value="${st.dataInicial?toInputDate(st.dataInicial):''}"></div>
      <div class="filter-group"><label>Data Final</label><input type="date" id="comm-data-fim" value="${st.dataFinal?toInputDate(st.dataFinal):''}"></div>
      <div class="filter-group">
        <label>Atalhos</label>
        <div id="comm-atalhos" style="display:flex;gap:4px;flex-wrap:wrap;">
          ${renderAtalhos(atalhoAtivoPorDatas(st.dataInicial,st.dataFinal,['mes_atual','mes_ant']),'atalhoComissao',['mes_atual','mes_ant','tudo'])}
        </div>
      </div>
      <div class="filter-group">
        <label>Apenas Repositor (Cargo)?</label>
        <div class="toggle-group" id="comm-repositor-toggle">
          <button data-v="NAO" class="${!commissionOnlyRepositor?'active':''}">Não</button>
          <button data-v="SIM" class="${commissionOnlyRepositor?'active':''}">Sim</button>
        </div>
      </div>
      <div class="spacer"></div>
      ${badgePeriodo}
      <span class="hint-box" style="margin:0;padding:6px 12px;">${commissionQuadroAtual==='SIM' ? `Exibindo apenas os <strong>${commissionOnlyRepositor && currentTeam.cargoDisponivel ? currentTeam.repositorCodes.size : currentTeam.codes.size}</strong>${commissionOnlyRepositor && currentTeam.cargoDisponivel ? ' repositores (cargo REPOSITOR)' : ' do quadro atual'}` : `Exibindo <strong>todos</strong> os repositores históricos`}</span>
    </div>
    ${commissionOnlyRepositor && !currentTeam.cargoDisponivel ? `<div class="warn-box">A coluna CARGO não foi encontrada na aba QUADRO REP — o filtro "Apenas Repositor" não tem efeito até essa coluna existir no arquivo.</div>` : ``}

    <div class="panel" style="border:1.5px solid #2f6fce;background:#eff6ff;">
      <div class="panel-header"><h3>Desconto por % Qualidade</h3></div>
      <div class="toolbar" style="margin-bottom:0;">
        <div class="filter-group">
          <label>Aplicar desconto por qualidade?</label>
          <div class="toggle-group" id="comm-desconto-toggle">
            <button data-v="SIM" class="${commissionAplicarDesconto==='SIM'?'active':''}">Sim</button>
            <button data-v="NAO" class="${commissionAplicarDesconto==='NAO'?'active':''}">Não</button>
          </div>
        </div>
        <span class="small-muted">Qualidade &lt;50% zera a comissão · 50-69% paga metade · ≥70% paga o % da qualidade sobre o valor normal (ex.: 71% de qualidade = 71% da comissão). Sem auditoria no período, fica integral. Os dois totais (com e sem desconto) aparecem sempre no resumo abaixo — este toggle só decide qual valor conta como "Comissão Total" na tabela e na exportação.</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h3>Faixas de Pontuação</h3><div class="panel-actions"><button class="btn btn-outline btn-sm" id="add-band">+ Adicionar faixa</button></div></div>
        <div id="bands-editor"></div>
        <p class="panel-note">O gestor pode editar pontuação inicial, final e valor por ponto de cada faixa, além de ativar/desativar ou remover.</p>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Exceções Individuais</h3><div class="panel-actions"><button class="btn btn-outline btn-sm" id="add-exception">+ Adicionar exceção</button></div></div>
        <div id="exceptions-editor"></div>
        <p class="panel-note">Exceções vinculadas ao código têm prioridade sobre a faixa normal.</p>
      </div>
    </div>

    <div class="panel" id="comissao-hist-panel">
      <div class="panel-header"><h3>Histórico do Valor de Comissão</h3><span class="small-muted">mês a mês · os meses do período filtrado ficam destacados</span></div>
      <div class="chart-wrap"><canvas id="chart-comissao-hist"></canvas></div>
    </div>

    <div class="panel" id="comissao-calculada-panel">
      <div class="panel-header">
        <h3>Comissão Calculada</h3>
        <div class="panel-actions" style="flex-wrap:wrap;gap:8px;">
          <div class="filter-group" style="min-width:auto;">
            <label>Considerar Missões?</label>
            <div class="toggle-group" id="comm-considerar-missoes">
              <button data-v="SIM" class="${commissionConsiderarMissoes==='SIM'?'active':''}">Sim</button>
              <button data-v="NAO" class="${commissionConsiderarMissoes==='NAO'?'active':''}">Não</button>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-toggle-col-missoes">${commissionShowMissoes?'Ocultar':'Mostrar'} Missões</button>
          <button class="btn btn-outline btn-sm" id="btn-toggle-col-valorponto">${commissionShowValorPonto?'Ocultar':'Mostrar'} Valor/Ponto</button>
          <button class="btn btn-outline btn-sm" id="btn-toggle-col-regra">${commissionShowRegra?'Ocultar':'Mostrar'} Regra</button>
          <button class="btn btn-outline btn-sm" id="btn-toggle-col-comissao">${commissionShowComissaoTotal?'Ocultar':'Mostrar'} Comissão</button>
          <button class="btn btn-outline btn-sm" id="btn-export-comissao-pdf">PDF</button>
          <button class="btn btn-outline btn-sm" id="btn-export-comissao-png">PNG</button>
          <button class="btn btn-primary btn-sm" id="btn-export-comissao-xlsx">Exportar Excel</button>
        </div>
      </div>
      <p class="panel-note">Pontos = Produção (O.S. 58)${commissionConsiderarMissoes==='SIM'?' + Missões (O.S. equivalente: Média Histórica do colaborador × Tempo da Missão ÷ 9h, arredondado para baixo)':' — missões NÃO somadas (toggle "Considerar Missões?" está em Não)'}.</p>
      <div id="commissao-resumo-periodo" class="hint-box" style="font-weight:700;"></div>
      <div class="table-wrap"><table class="data-table">
        <thead id="commission-thead"></thead>
        <tbody id="commission-tbody"></tbody>
      </table></div>
    </div>
  `;

  $("#comm-desconto-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    commissionAplicarDesconto = b.dataset.v;
    renderCommissionTable();
  });
  $("#comm-quadro-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    commissionQuadroAtual = b.dataset.v;
    renderComissao();
  });
  $("#comm-repositor-toggle").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    commissionOnlyRepositor = b.dataset.v === "SIM";
    renderComissao();
  });
  $("#comm-considerar-missoes").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    commissionConsiderarMissoes = b.dataset.v;
    renderComissao();
  });
  $("#comm-data-ini").addEventListener("change", e=>{ st.dataInicial = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderComissao(); });
  $("#comm-data-fim").addEventListener("change", e=>{ st.dataFinal = e.target.value?new Date(e.target.value+"T00:00:00"):null; renderComissao(); });
  $("#btn-toggle-col-missoes").addEventListener("click", ()=>{ commissionShowMissoes = !commissionShowMissoes; renderComissao(); });
  $("#btn-toggle-col-valorponto").addEventListener("click", ()=>{ commissionShowValorPonto = !commissionShowValorPonto; renderComissao(); });
  $("#btn-toggle-col-regra").addEventListener("click", ()=>{ commissionShowRegra = !commissionShowRegra; renderComissao(); });
  $("#btn-toggle-col-comissao").addEventListener("click", ()=>{ commissionShowComissaoTotal = !commissionShowComissaoTotal; renderComissao(); });
  $("#btn-export-comissao-xlsx").addEventListener("click", exportComissaoToExcel);
  $("#btn-export-comissao-pdf").addEventListener("click", ()=>{
    Export.toPDF(document.getElementById("comissao-calculada-panel"), "comissao-calculada");
  });
  $("#btn-export-comissao-png").addEventListener("click", ()=>{
    Export.toPNG(document.getElementById("comissao-calculada-panel"), "comissao-calculada");
  });

  renderBandsEditor();
  renderExceptionsEditor();
  renderCommissionTable();

  $("#add-band").addEventListener("click", ()=>{
    cfg.bands.push({ min:0, max:0, value:0, active:true });
    renderBandsEditor(); renderCommissionTable();
  });
  $("#add-exception").addEventListener("click", ()=>{
    cfg.exceptions.push({ codigo:"", nome:"", valuePerPoint:0.40, active:true });
    renderExceptionsEditor(); renderCommissionTable();
  });
}

function renderBandsEditor(){
  const cfg = window.APP_STATE.commissionConfig;
  const el = $("#bands-editor");
  el.innerHTML = `<div class="band-row" style="font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase;">
      <div>Pontuação Inicial</div><div>Pontuação Final</div><div>Valor por Ponto (R$)</div><div></div>
    </div>` +
    cfg.bands.map((b,i)=>`
      <div class="band-row">
        <input type="number" step="1" value="${b.min}" data-i="${i}" data-f="min">
        <input type="number" step="1" value="${b.max}" data-i="${i}" data-f="max">
        <input type="number" step="0.01" value="${b.value}" data-i="${i}" data-f="value">
        <div style="display:flex;gap:6px;align-items:center;">
          <label class="small-muted" style="display:flex;align-items:center;gap:4px;"><input type="checkbox" ${b.active!==false?'checked':''} data-i="${i}" data-f="active"> Ativa</label>
          <button class="icon-btn" data-i="${i}" data-act="del">✕</button>
        </div>
      </div>`).join("");

  $all('#bands-editor input[type="number"]').forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const i = Number(inp.dataset.i), f = inp.dataset.f;
      cfg.bands[i][f] = Number(inp.value);
      renderCommissionTable();
    });
  });
  $all('#bands-editor input[type="checkbox"]').forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const i = Number(inp.dataset.i);
      cfg.bands[i].active = inp.checked;
      renderCommissionTable();
    });
  });
  $all('#bands-editor button[data-act="del"]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      cfg.bands.splice(Number(btn.dataset.i),1);
      renderBandsEditor(); renderCommissionTable();
    });
  });
}

function renderExceptionsEditor(){
  const cfg = window.APP_STATE.commissionConfig;
  const el = $("#exceptions-editor");
  el.innerHTML = (cfg.exceptions.length ? `<div class="exception-row" style="font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase;">
      <div>Código</div><div>Nome</div><div>R$/Ponto</div><div>Ativo</div><div></div>
    </div>` : `<p class="small-muted">Nenhuma exceção cadastrada.</p>`) +
    cfg.exceptions.map((ex,i)=>`
      <div class="exception-row">
        <input type="text" value="${escapeHtml(ex.codigo)}" data-i="${i}" data-f="codigo" placeholder="Código">
        <input type="text" value="${escapeHtml(ex.nome)}" data-i="${i}" data-f="nome" placeholder="Nome (opcional)">
        <input type="number" step="0.01" value="${ex.valuePerPoint}" data-i="${i}" data-f="valuePerPoint">
        <input type="checkbox" ${ex.active!==false?'checked':''} data-i="${i}" data-f="active">
        <button class="icon-btn" data-i="${i}" data-act="del">✕</button>
      </div>`).join("");

  $all('#exceptions-editor input[type="text"], #exceptions-editor input[type="number"]').forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const i = Number(inp.dataset.i), f = inp.dataset.f;
      cfg.exceptions[i][f] = f==="valuePerPoint" ? Number(inp.value) : inp.value;
      renderCommissionTable();
    });
  });
  $all('#exceptions-editor input[type="checkbox"]').forEach(inp=>{
    inp.addEventListener("change", ()=>{
      cfg.exceptions[Number(inp.dataset.i)].active = inp.checked;
      renderCommissionTable();
    });
  });
  $all('#exceptions-editor button[data-act="del"]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      cfg.exceptions.splice(Number(btn.dataset.i),1);
      renderExceptionsEditor(); renderCommissionTable();
    });
  });
}

function renderMissionsEditor(){
  const cfg = window.APP_STATE.commissionConfig;
  const el = $("#missions-editor");
  el.innerHTML = `<div class="band-row" style="grid-template-columns:1.6fr .8fr .8fr .8fr auto;font-size:11px;font-weight:700;color:var(--gray-500);text-transform:uppercase;">
      <div>Nome</div><div>Qtd</div><div>O.S. Equiv.</div><div>R$/O.S.</div><div></div>
    </div>` +
    cfg.missions.map((m,i)=>`
      <div class="band-row" style="grid-template-columns:1.6fr .8fr .8fr .8fr auto;">
        <input type="text" value="${escapeHtml(m.name)}" data-i="${i}" data-f="name">
        <input type="number" step="1" value="${m.qty}" data-i="${i}" data-f="qty">
        <input type="number" step="1" value="${m.osEquiv}" data-i="${i}" data-f="osEquiv">
        <input type="number" step="0.01" value="${m.valuePerOs}" data-i="${i}" data-f="valuePerOs">
        <div><span class="small-muted">${fmtBRL(m.qty*m.osEquiv*m.valuePerOs)}</span> <button class="icon-btn" data-i="${i}" data-act="del">✕</button></div>
      </div>`).join("");

  $all('#missions-editor input').forEach(inp=>{
    inp.addEventListener("change", ()=>{
      const i = Number(inp.dataset.i), f = inp.dataset.f;
      cfg.missions[i][f] = f==="name" ? inp.value : Number(inp.value);
      renderMissionsEditor(); renderCommissionTable();
    });
  });
  $all('#missions-editor button[data-act="del"]').forEach(btn=>{
    btn.addEventListener("click", ()=>{
      cfg.missions.splice(Number(btn.dataset.i),1);
      renderMissionsEditor(); renderCommissionTable();
    });
  });
}

// Centraliza a lógica de "quais linhas mostrar" — reutilizada pela tabela E pela exportação Excel,
// garantindo que o Excel exportado reflita exatamente os mesmos filtros/toggles da tela.
function getComissaoTableData(ini, fim){
  const currentTeam = window.APP_STATE.currentTeam;
  const st = CommissionState;
  if(ini===undefined && fim===undefined){ ini = st.dataInicial; fim = st.dataFinal; }
  let data = Commission.computeAll(ini, fim, commissionConsiderarMissoes==="SIM");
  if(commissionQuadroAtual === "SIM"){
    data = data.filter(e=> currentTeam.codes.has(e.codKey));
  }
  if(commissionOnlyRepositor && currentTeam.cargoDisponivel){
    const cargoMap = new Map(currentTeam.members.map(m=>[m.codKey, m.cargo]));
    data = data.filter(e=> cargoMap.get(e.codKey) === "REPOSITOR");
  }
  return data;
}

// total de comissão de cada mês (mesmos filtros de quadro/cargo/missões/desconto da tela)
function comissaoHistoricoMensal(){
  const rows = window.APP_STATE.processed.p8460.filter(r=>r.tipoos===58 && r.dtinicio);
  if(!rows.length) return [];
  let min = null; rows.forEach(r=>{ const d = r.dtinicio; if(!min || d<min) min = d; });
  const h = new Date(); let y = min.getFullYear(), m = min.getMonth();
  const limite = new Date(h.getFullYear(), h.getMonth()-23, 1); if(new Date(y,m,1) < limite){ y = limite.getFullYear(); m = limite.getMonth(); }
  const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"], out = [];
  while(y < h.getFullYear() || (y===h.getFullYear() && m<=h.getMonth())){
    const ini = new Date(y,m,1), fim = new Date(y,m+1,0,23,59,59);
    const d = getComissaoTableData(ini, fim);
    out.push({ ini, fim, label: nomes[m]+"/"+String(y).slice(2), n:d.length, sem:sum(d.map(e=>e.comissaoBase)), com:sum(d.map(e=>e.comissaoComDesconto)) });
    m++; if(m>11){ m=0; y++; }
  }
  return out;
}

function renderComissaoHistorico(){
  if(!document.getElementById("chart-comissao-hist")) return;
  const hist = comissaoHistoricoMensal(), st = CommissionState;
  const dentro = h=> (!st.dataInicial || h.fim >= dateOnly(st.dataInicial)) && (!st.dataFinal || h.ini <= dateOnly(st.dataFinal));
  const aplicado = commissionAplicarDesconto==="SIM" ? "com" : "sem";
  Charts.make("chart-comissao-hist", {
    type:"line",
    data:{ labels: hist.map(h=>h.label), datasets:[
      { label:"Total sem desconto", data:hist.map(h=>h.sem), borderColor:Charts.colors.blue, backgroundColor:"rgba(47,111,206,.10)", fill:true, tension:.3,
        pointRadius:hist.map(h=>dentro(h)?6:3), pointBackgroundColor:hist.map(h=>dentro(h)?Charts.colors.blue:"#fff"), pointBorderColor:Charts.colors.blue, pointHoverRadius:8,
        datalabels:{ display: aplicado==="sem", align:"top", anchor:"end", color:Charts.colors.blue, font:{size:11,weight:"700"}, formatter:v=>fmtBRL(v) } },
      { label:"Total com desconto de qualidade", data:hist.map(h=>h.com), borderColor:Charts.colors.green, backgroundColor:Charts.colors.green, borderDash:[5,4], tension:.3,
        pointRadius:hist.map(h=>dentro(h)?6:3), pointBackgroundColor:hist.map(h=>dentro(h)?Charts.colors.green:"#fff"), pointBorderColor:Charts.colors.green, pointHoverRadius:8,
        datalabels:{ display: aplicado==="com", align:"top", anchor:"end", color:Charts.colors.green, font:{size:11,weight:"700"}, formatter:v=>fmtBRL(v) } }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, layout:{ padding:{ top:22, bottom:6, left:4, right:14 } },
      interaction:{ mode:"index", intersect:false },
      plugins:{ legend:{ labels:{font:{size:11}} },
        tooltip:{ callbacks:{ label:c=> c.dataset.label+": "+fmtBRL(c.parsed.y), afterBody:items=>{ const h = hist[items[0].dataIndex]; return h ? ["", h.n+" repositor(es)"] : []; } } } },
      scales:{ y:{ beginAtZero:true, grid:{color:"rgba(128,140,160,.18)"}, ticks:{ callback:v=>fmtBRL(v) } }, x:{ grid:{display:false} } }
    }
  });
}

function renderCommissionTable(){
  renderComissaoHistorico();
  const data = getComissaoTableData();
  const st = CommissionState;
  const qualClass = (v) => v===null||v===undefined ? '' : v>=90 ? 'cell-pos' : v>=70 ? 'cell-warn' : 'cell-neg';
  const qualLabel = (v) => v===null||v===undefined ? '<span class="small-muted">Sem auditoria</span>' : fmtNum(v,1)+'%';

  // cabeçalho dinâmico conforme colunas visíveis
  const theadHtml = `<tr>
    <th>Código</th><th>Repositor</th><th>Produção (O.S. 58)</th>
    ${commissionShowMissoes?'<th>Missões (O.S. equiv.)</th>':''}
    <th>Pontos</th>
    <th>% Qualidade (período)</th>
    ${commissionShowValorPonto?'<th>Valor/Ponto</th>':''}
    ${commissionShowRegra?'<th>Regra</th>':''}
    ${commissionShowComissaoTotal?'<th>Comissão Base</th><th>Comissão Total (c/ ajuste)</th>':''}
  </tr>`;
  $("#commission-thead").innerHTML = theadHtml;

  $("#commission-tbody").innerHTML = data.map(e=>`
    <tr>
      <td>${e.cod||'-'}</td><td>${escapeHtml(e.nome)}</td><td>${fmtNum(e.producao)}</td>
      ${commissionShowMissoes?`<td>${e.missoesOs>0?`<span class="tag-pos">+${fmtNum(e.missoesOs)}</span>`:'-'}</td>`:''}
      <td><strong>${fmtNum(e.pontos)}</strong></td>
      <td class="${qualClass(e.qualidade)}">${qualLabel(e.qualidade)}</td>
      ${commissionShowValorPonto?`<td>${fmtBRL(e.valorPonto)}</td>`:''}
      ${commissionShowRegra?`<td>${e.regra.startsWith('Exceção Individual')?`<span class="tag-warn">${e.regra}</span>`:e.regra.startsWith('Regra Normal')?`<span class="tag-neutral">${e.regra}</span>`:`<span class="tag-neg">${e.regra}</span>`}</td>`:''}
      ${commissionShowComissaoTotal?`<td class="small-muted">${fmtBRL(e.comissaoBase)}</td><td><strong>${fmtBRL(e.comissaoTotal)}</strong></td>`:''}
    </tr>`).join("") || `<tr><td colspan="10" class="small-muted">Nenhuma produção encontrada.</td></tr>`;

  // resumo: período selecionado + os dois totais (com e sem desconto), sempre os dois —
  // o toggle "Aplicar desconto?" só decide qual vira a "Comissão Total" oficial da tabela/export
  const periodoLabel = (st.dataInicial || st.dataFinal)
    ? `${st.dataInicial?fmtDateBR(st.dataInicial):'início'} até ${st.dataFinal?fmtDateBR(st.dataFinal):'hoje'}`
    : "todo o histórico";
  const totalSemDesconto = sum(data.map(e=>e.comissaoBase));
  const totalComDesconto = sum(data.map(e=>e.comissaoComDesconto));
  const resumoEl = $("#commissao-resumo-periodo");
  if(resumoEl){
    resumoEl.innerHTML = `📅 Período: <strong>${periodoLabel}</strong> &nbsp;·&nbsp; 👥 ${data.length} repositor(es)<br>` +
      `💰 Total <strong>sem</strong> desconto: <strong>${fmtBRL(totalSemDesconto)}</strong>` +
      (commissionAplicarDesconto==='NAO' ? ' <span class="tag-pos">valor aplicado ✓</span>' : '') +
      ` &nbsp;·&nbsp; 💰 Total <strong>com</strong> desconto: <strong>${fmtBRL(totalComDesconto)}</strong>` +
      (commissionAplicarDesconto==='SIM' ? ' <span class="tag-pos">valor aplicado ✓</span>' : '') +
      (commissionConsiderarMissoes==='NAO' ? ' <span class="tag-neutral">missões não consideradas</span>' : '') +
      (commissionOnlyRepositor ? ' <span class="tag-neutral">somente cargo Repositor</span>' : '');
  }
}

// Exporta a tabela "Comissão Calculada" para .xlsx, respeitando exatamente os filtros e
// toggles de coluna atualmente selecionados na tela (quadro atual, apenas repositor,
// considerar missões, colunas visíveis).
function exportComissaoToExcel(){
  if(typeof XLSX === "undefined"){
    toast("A biblioteca de exportação (SheetJS) ainda não carregou. Aguarde e tente novamente.", "error");
    return;
  }
  const data = getComissaoTableData();
  const st = CommissionState;

  const header = ["Código", "Repositor", "Produção (O.S. 58)"];
  if(commissionShowMissoes) header.push("Missões (O.S. equiv.)");
  header.push("Pontos");
  header.push("% Qualidade (período)");
  if(commissionShowValorPonto) header.push("Valor/Ponto (R$)");
  if(commissionShowRegra) header.push("Regra");
  if(commissionShowComissaoTotal) header.push("Comissão Base (R$)", "Comissão Total c/ ajuste (R$)");

  const periodoLabel = (st.dataInicial || st.dataFinal)
    ? `${st.dataInicial?fmtDateBR(st.dataInicial):'inicio'} ate ${st.dataFinal?fmtDateBR(st.dataFinal):'hoje'}`
    : "todo o historico";
  const totalSemDesconto = sum(data.map(e=>e.comissaoBase));
  const totalComDesconto = sum(data.map(e=>e.comissaoComDesconto));

  const aoa = [
    ["Comissão Calculada — Núcleo Reposição"],
    ["Período:", periodoLabel],
    ["Considerar Missões:", commissionConsiderarMissoes==='SIM' ? 'Sim' : 'Não'],
    ["Apenas Repositor:", commissionOnlyRepositor ? 'Sim' : 'Não'],
    ["Aplicar Desconto por Qualidade (valor usado como Comissão Total):", commissionAplicarDesconto==='SIM' ? 'Sim' : 'Não'],
    ["Total SEM desconto:", totalSemDesconto],
    ["Total COM desconto:", totalComDesconto],
    [],
    header
  ];
  data.forEach(e=>{
    const row = [e.cod||'-', e.nome, e.producao];
    if(commissionShowMissoes) row.push(e.missoesOs);
    row.push(e.pontos);
    row.push(e.qualidade!==null && e.qualidade!==undefined ? +e.qualidade.toFixed(1) : 'Sem auditoria');
    if(commissionShowValorPonto) row.push(+e.valorPonto.toFixed(2));
    if(commissionShowRegra) row.push(e.regra);
    if(commissionShowComissaoTotal){ row.push(+e.comissaoBase.toFixed(2)); row.push(+e.comissaoTotal.toFixed(2)); }
    aoa.push(row);
  });

  try{
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = header.map(()=>({ wch:20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comissao Calculada");
    XLSX.writeFile(wb, `comissao-calculada-${Date.now()}.xlsx`);
    toast("Excel exportado com sucesso.", "success");
  }catch(err){
    console.error(err);
    toast("Falha ao exportar Excel: " + err.message, "error");
  }
}

/* ---------------------------------------------------------------------- */
/* MODULE: Cronograma (Gestão > Cronograma)                                */
/* ---------------------------------------------------------------------- */
const CronogramaState = { activities: [] }; // {id, nome, horaInicioMin, horaFimMin, prioridade}

const PRIORIDADE_COLORS = { 1:"#d64545", 2:"#4a72c4", 3:"#f5b400" };
const PRIORIDADE_LABELS = { 1:"Prioridade 1 (vermelho)", 2:"Prioridade 2 (azul)", 3:"Prioridade 3 (amarelo)" };

function minutesToHHMM(min){
  if(min===null || min===undefined || isNaN(min)) return "";
  const h = Math.floor(min/60), m = Math.round(min%60);
  return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
}
function hhmmToMinutes(str){
  if(!str) return null;
  const parts = String(str).split(":");
  const h = Number(parts[0]), m = Number(parts[1]);
  if(isNaN(h) || isNaN(m)) return null;
  return h*60 + m;
}

// Empacota atividades em "linhas" (como um calendário) para que atividades com
// horários sobrepostos fiquem em linhas diferentes, e as que não se sobrepõem
// dividam a mesma linha — igual à referência visual enviada.
function packCronogramaRows(activities){
  const sorted = [...activities].sort((a,b)=>a.horaInicioMin-b.horaInicioMin);
  const rowEnds = [];
  const positioned = [];
  sorted.forEach(act=>{
    let placedRow = -1;
    for(let i=0;i<rowEnds.length;i++){
      if(act.horaInicioMin >= rowEnds[i]){ placedRow = i; break; }
    }
    if(placedRow===-1){
      rowEnds.push(act.horaFimMin);
      placedRow = rowEnds.length-1;
    } else {
      rowEnds[placedRow] = act.horaFimMin;
    }
    positioned.push({ ...act, row: placedRow });
  });
  return { positioned, numRows: rowEnds.length || 1 };
}

// Constrói o HTML do quadro-horário (usado tanto na tela quanto na exportação —
// mesma função garante que o que você vê é exatamente o que é exportado).
function buildCronogramaHtml(activities){
  if(!activities.length){
    return `
      <div style="background:#0b2647;border-radius:10px 10px 0 0;padding:14px;text-align:center;">
        <span style="color:#fff;font-weight:800;font-size:15px;">Cronograma Dia / Reposição</span>
      </div>
      <div style="border:4px solid #4a72c4;border-radius:0 0 14px 14px;padding:40px;background:#fff;text-align:center;">
        <span style="color:#7a8798;font-size:13px;">Nenhuma atividade cadastrada. Adicione atividades abaixo para montar o cronograma.</span>
      </div>`;
  }

  const minStart = Math.min(...activities.map(a=>a.horaInicioMin));
  const maxEnd = Math.max(...activities.map(a=>a.horaFimMin));
  const startHour = Math.floor(minStart/60);
  const endHour = Math.ceil(maxEnd/60);

  const { positioned, numRows } = packCronogramaRows(activities);
  const headerHeight = 42;
  const rowHeight = 56;
  const chartHeight = headerHeight + numRows*rowHeight + 14;

  // O intervalo total do gráfico é sempre em horas cheias (ex: 08:00 a 18:00) — isso é
  // o que faz uma barra terminando exatamente às 18:00 preencher 100% da largura, sem
  // sobrar espaço fantasma.
  const chartStart = startHour*60;
  const chartEnd = endHour*60;
  const totalMin = Math.max(1, chartEnd - chartStart);

  // Cabeçalho: SEMPRE e SÓ hora cheia (8:00, 9:00 ... 18:00) — nunca mostra horário
  // fracionário de atividade (mesmo que uma atividade comece às 17:30, o cabeçalho
  // continua só com horas cheias). Todas as colunas têm exatamente a mesma largura.
  // As barras (abaixo) continuam usando os horários reais/proporcionais das
  // atividades, totalmente independente de como o cabeçalho está dividido — então
  // uma atividade de 17:30–18:00 preenche certinho a metade da última coluna.
  const numCols = endHour - startHour;
  const colWidthPct = 100 / numCols;
  const hourHeaderHtml = Array.from({length:numCols}).map((_,i)=>{
    const h = startHour + i;
    const leftPct = i * colWidthPct;
    const isLast = i === numCols - 1;
    if(isLast){
      // última coluna: mostra hora de início E hora de fim na mesma caixa (uma em
      // cada ponta) — evita qualquer sobreposição entre os dois rótulos.
      return `<div style="position:absolute;left:${leftPct}%;width:${colWidthPct}%;top:0;height:${headerHeight}px;background:#4a72c4;display:flex;align-items:center;justify-content:space-between;overflow:hidden;">
        <span style="color:#fff;font-weight:800;font-size:12.5px;white-space:nowrap;padding-left:8px;">${String(h).padStart(2,"0")}:00</span>
        <span style="color:#fff;font-weight:800;font-size:12.5px;white-space:nowrap;padding-right:8px;">${String(endHour).padStart(2,"0")}:00</span>
      </div>`;
    }
    return `<div style="position:absolute;left:${leftPct}%;width:${colWidthPct}%;top:0;height:${headerHeight}px;background:#4a72c4;border-right:1px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:flex-start;overflow:hidden;">
      <span style="color:#fff;font-weight:800;font-size:12.5px;white-space:nowrap;padding-left:8px;">${String(h).padStart(2,"0")}:00</span>
    </div>`;
  }).join("");

  const gridLinesHtml = Array.from({length:numCols+1}).map((_,i)=>{
    const leftPct = i * colWidthPct;
    return `<div style="position:absolute;left:${leftPct}%;top:${headerHeight}px;bottom:0;width:1px;background:rgba(255,255,255,.6);"></div>`;
  }).join("");

  const rowStripesHtml = Array.from({length:numRows}).map((_,r)=>{
    const top = headerHeight + r*rowHeight;
    return `<div style="position:absolute;left:0;right:0;top:${top}px;height:${rowHeight}px;background:${r%2===0?'#e4e9f5':'#dbe1f0'};"></div>`;
  }).join("");

  const barsHtml = positioned.map(act=>{
    const leftPct = ((act.horaInicioMin - chartStart) / totalMin) * 100;
    const widthPct = ((act.horaFimMin - act.horaInicioMin) / totalMin) * 100;
    const top = headerHeight + act.row*rowHeight + 8;
    const color = PRIORIDADE_COLORS[act.prioridade] || PRIORIDADE_COLORS[2];
    return `<div style="position:absolute;left:calc(${leftPct}% + 1.5px);width:calc(${widthPct}% - 3px);top:${top}px;height:${rowHeight-16}px;background:${color};border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 6px;box-shadow:0 2px 4px rgba(0,0,0,.18);overflow:hidden;">
      <span style="color:#fff;font-weight:800;font-size:11.5px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${escapeHtml(act.nome)} (${minutesToHHMM(act.horaInicioMin)}–${minutesToHHMM(act.horaFimMin)})">${escapeHtml(act.nome)}</span>
    </div>`;
  }).join("");

  return `
    <div style="background:#0b2647;border-radius:10px 10px 0 0;padding:14px;text-align:center;">
      <span style="color:#fff;font-weight:800;font-size:15px;">Cronograma Dia / Reposição</span>
    </div>
    <div style="border:4px solid #4a72c4;border-radius:0 0 14px 14px;padding:14px;background:#fff;">
      <div style="position:relative;height:${chartHeight}px;background:#dde3f0;border-radius:8px;overflow:hidden;">
        ${rowStripesHtml}
        ${hourHeaderHtml}
        ${gridLinesHtml}
        ${barsHtml}
      </div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:#4a72c4;font-weight:700;">Obs: Agenda pode ser alterada sem aviso prévio para atender a operação.</div>
    <div style="margin-top:8px;display:flex;gap:16px;font-size:11px;color:#4a5568;">
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${PRIORIDADE_COLORS[1]};margin-right:4px;"></span>Prioridade 1</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${PRIORIDADE_COLORS[2]};margin-right:4px;"></span>Prioridade 2</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${PRIORIDADE_COLORS[3]};margin-right:4px;"></span>Prioridade 3</span>
    </div>
  `;
}

function renderCronograma(){
  const pane = $("#pane-cronograma");
  const processed = window.APP_STATE.processed;

  pane.innerHTML = `
    ${processed && !processed.cronogramaDispo ? `<div class="hint-box">A aba <strong>CRONOGRAMA</strong> não foi encontrada no arquivo — sem problema, você pode cadastrar as atividades manualmente abaixo. Se adicionar essa aba ao arquivo (colunas: Atividade, Hora Início, Hora Fim, Prioridade) ela será usada para pré-popular esta tela na próxima vez que carregar o arquivo.</div>` : ``}

    <div class="panel">
      <div class="panel-header">
        <h3>Cronograma Dia / Reposição</h3>
        <div class="panel-actions">
          <button class="btn btn-outline btn-sm" id="btn-export-cronograma-pdf">PDF</button>
          <button class="btn btn-outline btn-sm" id="btn-export-cronograma-png">PNG</button>
          <button class="btn btn-primary btn-sm" id="btn-export-cronograma-xlsx">Excel</button>
        </div>
      </div>
      <div id="cronograma-timeline-area">
        ${buildCronogramaHtml(CronogramaState.activities)}
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>+ Adicionar Nova Atividade</h3></div>
      <div class="toolbar" style="margin-bottom:0;">
        <div class="filter-group" style="flex:2;">
          <label>Nome da Atividade</label>
          <input type="text" id="cron-nome" placeholder="Ex: Validação Picking">
        </div>
        <div class="filter-group">
          <label>Hora Início</label>
          <input type="time" id="cron-hora-inicio">
        </div>
        <div class="filter-group">
          <label>Hora Fim</label>
          <input type="time" id="cron-hora-fim">
        </div>
        <div class="filter-group">
          <label>Prioridade</label>
          <select id="cron-prioridade">
            <option value="1">1 — Vermelho</option>
            <option value="2" selected>2 — Azul</option>
            <option value="3">3 — Amarelo</option>
          </select>
        </div>
        <button class="btn btn-primary" id="btn-add-cronograma">+ Adicionar</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>Atividades Cadastradas</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Atividade</th><th>Início</th><th>Fim</th><th>Prioridade</th><th></th></tr></thead>
          <tbody>
            ${[...CronogramaState.activities].sort((a,b)=>a.horaInicioMin-b.horaInicioMin).map(act=>`<tr>
              <td>${escapeHtml(act.nome)}</td>
              <td>${minutesToHHMM(act.horaInicioMin)}</td>
              <td>${minutesToHHMM(act.horaFimMin)}</td>
              <td><span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:3px;background:${PRIORIDADE_COLORS[act.prioridade]};display:inline-block;"></span>${act.prioridade}</span></td>
              <td><button class="icon-btn" onclick="removeCronogramaActivity('${act.id}')">✕</button></td>
            </tr>`).join("") || `<tr><td colspan="5" class="small-muted">Nenhuma atividade cadastrada ainda.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  $("#btn-add-cronograma").addEventListener("click", addCronogramaActivity);
  $("#btn-export-cronograma-pdf").addEventListener("click", ()=>{
    Export.toPDFSinglePage(document.getElementById("cronograma-timeline-area"), "cronograma", "landscape");
  });
  $("#btn-export-cronograma-png").addEventListener("click", ()=>{
    Export.toPNG(document.getElementById("cronograma-timeline-area"), "cronograma");
  });
  $("#btn-export-cronograma-xlsx").addEventListener("click", exportCronogramaToExcel);
}

function addCronogramaActivity(){
  const nome = $("#cron-nome").value.trim();
  const horaInicio = $("#cron-hora-inicio").value;
  const horaFim = $("#cron-hora-fim").value;
  const prioridade = Number($("#cron-prioridade").value);

  if(!nome){ toast("Informe o nome da atividade.", "error"); return; }
  const horaInicioMin = hhmmToMinutes(horaInicio);
  const horaFimMin = hhmmToMinutes(horaFim);
  if(horaInicioMin===null || horaFimMin===null){ toast("Informe hora de início e hora de fim válidas.", "error"); return; }
  if(horaFimMin <= horaInicioMin){ toast("A hora de fim deve ser depois da hora de início.", "error"); return; }

  CronogramaState.activities.push({
    id: "cr_" + Date.now() + "_" + Math.random().toString(36).slice(2,7),
    nome, horaInicioMin, horaFimMin, prioridade: [1,2,3].includes(prioridade) ? prioridade : 2
  });
  toast("Atividade adicionada.", "success");
  renderCronograma();
}

function removeCronogramaActivity(id){
  CronogramaState.activities = CronogramaState.activities.filter(a=>a.id!==id);
  renderCronograma();
}

function exportCronogramaToExcel(){
  if(typeof XLSX === "undefined"){
    toast("A biblioteca de exportação (SheetJS) ainda não carregou. Aguarde e tente novamente.", "error");
    return;
  }
  const activities = [...CronogramaState.activities].sort((a,b)=>a.horaInicioMin-b.horaInicioMin);
  const header = ["Atividade", "Hora Início", "Hora Fim", "Prioridade"];
  const aoa = [
    ["Cronograma Dia / Reposição — Núcleo Reposição"],
    ["Gerado em:", fmtDateBR(new Date())],
    [],
    header
  ];
  activities.forEach(act=>{
    aoa.push([act.nome, minutesToHHMM(act.horaInicioMin), minutesToHHMM(act.horaFimMin), act.prioridade]);
  });

  try{
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{wch:28},{wch:12},{wch:12},{wch:12}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cronograma");
    XLSX.writeFile(wb, `cronograma-${Date.now()}.xlsx`);
    toast("Excel exportado com sucesso.", "success");
  }catch(err){
    console.error(err);
    toast("Falha ao exportar Excel: " + err.message, "error");
  }
}

/* ---------------------------------------------------------------------- */
/* MODULE: Acompanhamento Individual (Indicadores > Acompanhamento)       */
/* ---------------------------------------------------------------------- */
let individualState = {
  codKey: null,
  meta: 660,           // Meta mensal de O.S. (editável)
  metaDia: 30,         // Meta diária (calculada automaticamente ou editável)
  linhaDeCorteMes: 550 // Linha de corte mensal
};

// Calcula todos os indicadores de um colaborador para o mês atual
function computeIndividual(codKey, meta){
  const processed = window.APP_STATE.processed;
  const registry = window.APP_STATE.nameRegistry;
  // Usa maxDate GLOBAL (de todos os funcionários) — nunca o maxDate filtrado pelo
  // Production.state.employees, que varia por pessoa e causa divergência de valores.
  const allRows8460 = processed.p8460.filter(r=>r.tipoos===58);
  const maxDate = allRows8460.length ? new Date(Math.max(...allRows8460.map(r=>r.dtinicio.getTime()))) : null;
  if(!maxDate || !codKey) return null;

  const y = maxDate.getFullYear(), m = maxDate.getMonth();
  const rows58emp = processed.p8460.filter(r=>r.tipoos===58 && r.codKey===codKey);

  // Dias úteis totais do mês e dias corridos (úteis já passados)
  const diasUteisMes = countWeekdaysInMonth(y, m);
  const diasCorridosUteis = countWeekdaysUpToDay(y, m, maxDate.getDate());
  const diasRestantes = diasUteisMes - diasCorridosUteis;

  // O.S. acumuladas no mês até hoje
  const inicioMes = new Date(y, m, 1);
  const hojeD = dateOnly(maxDate);
  const rowsMesAtual = rows58emp.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=inicioMes && d<=hojeD; });
  const osAtual = rowsMesAtual.length;

  // Médias
  const mediaDiaMesAtual = diasCorridosUteis > 0 ? osAtual / diasCorridosUteis : 0;
  const mediaHistorica = Production.employeeHistoricalDailyAverage(codKey);

  // Média da SEMANA ANTERIOR (não a semana atual) — da segunda até sexta da semana passada
  const inicioSemanaAtual = startOfWeekMonday(maxDate);
  const inicioSemanaAnterior = addDays(inicioSemanaAtual, -7);
  const fimSemanaAnterior = addDays(inicioSemanaAtual, -1); // sexta-feira da semana passada
  const rowsSemAnt = rows58emp.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=inicioSemanaAnterior && d<=fimSemanaAnterior && isWeekday(r.dtinicio); });
  const diasSemAnt = uniq(rowsSemAnt.map(r=>ymdKey(r.dtinicio))).length || 1;
  const osSemana = rowsSemAnt.length;
  const mediaDiaSemanaAtual = osSemana / diasSemAnt;

  // Projeções (cada média × dias úteis do mês)
  const projetadoRitmoAtual = Math.round(mediaDiaMesAtual * diasUteisMes);
  const projetadoHistorico = Math.round(mediaHistorica * diasUteisMes);
  const projetadoSemana = Math.round(mediaDiaSemanaAtual * diasUteisMes);

  // Meta diária implícita para bater a meta mensal
  const metaDia = meta / diasUteisMes;

  // Média necessária a partir de hoje para atingir a meta
  const osFaltam = meta - osAtual;
  const mediaNecessaria = diasRestantes > 0 ? osFaltam / diasRestantes : null;

  // Dif % do projetado em relação à meta
  const difPct = (v) => v > 0 ? ((v - meta) / meta) * 100 : null;

  return {
    nome: registry.get(codKey) || codKey,
    diasUteisMes, diasCorridosUteis, diasRestantes,
    osAtual,
    mediaDiaMesAtual, mediaHistorica, mediaDiaSemanaAtual, metaDia,
    projetadoRitmoAtual, projetadoHistorico, projetadoSemana,
    osFaltam, mediaNecessaria,
    meta,
    difPct
  };
}

// Calcula o resumo de acompanhamento individual para todos os repositores da lista.
// Retorna: { rows (ordenados por mediaNecessaria desc), counts: {abaixo,corte,meta}, total }
function computeResumoTodos(empList, meta, corte){
  const rows = empList.map(e=>{
    const d = computeIndividual(e.codKey, meta);
    return d ? { ...d, codKey: e.codKey } : null;
  }).filter(Boolean).sort((a,b)=>{
    if(a.mediaNecessaria===null && b.mediaNecessaria===null) return 0;
    if(a.mediaNecessaria===null) return 1;
    if(b.mediaNecessaria===null) return -1;
    return b.mediaNecessaria - a.mediaNecessaria;
  });
  const total = rows.length;
  const meta_ = meta, corte_ = corte;
  const counts = rows.reduce((acc,d)=>{
    if(d.projetadoRitmoAtual >= meta_) acc.meta++;
    else if(d.projetadoRitmoAtual >= corte_) acc.corte++;
    else acc.abaixo++;
    return acc;
  }, { abaixo:0, corte:0, meta:0 });
  return { rows, counts, total };
}

// HTML dos cards de contagem (Abaixo / Corte / Meta) — reutilizado nos dois painéis
function buildStatusCountCards(counts, total, meta, corte){
  const pct = (n) => total > 0 ? fmtNum(n/total*100,1)+'%' : '0%';
  return `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
      <div class="card neg" style="flex:1;min-width:140px;">
        <div class="card-label">❌ Abaixo da Linha de Corte</div>
        <div class="card-value neg">${counts.abaixo}</div>
        <div class="card-sub">${pct(counts.abaixo)} do total · proj. &lt; ${fmtNum(corte)}</div>
      </div>
      <div class="card warn" style="flex:1;min-width:140px;">
        <div class="card-label">⚠️ Acima do Corte, Abaixo da Meta</div>
        <div class="card-value warn">${counts.corte}</div>
        <div class="card-sub">${pct(counts.corte)} do total · ${fmtNum(corte)}–${fmtNum(meta)}</div>
      </div>
      <div class="card pos" style="flex:1;min-width:140px;">
        <div class="card-label">✅ Atingindo a Meta</div>
        <div class="card-value pos">${counts.meta}</div>
        <div class="card-sub">${pct(counts.meta)} do total · proj. ≥ ${fmtNum(meta)}</div>
      </div>
      <div class="card" style="flex:1;min-width:140px;">
        <div class="card-label">👥 Total de Repositores</div>
        <div class="card-value">${total}</div>
        <div class="card-sub">Meta: ${fmtNum(meta)} · Corte: ${fmtNum(corte)}</div>
      </div>
    </div>`;
}

// HTML da tabela de visão geral (reutilizado nos dois painéis)
function buildResumoTable(rows, meta, corte){
  const pill = (proj) => {
    const c = proj>=meta?'#1a9c62':proj>=corte?'#e08a1f':'#d64545';
    const t = proj>=meta?'Meta ✅':proj>=corte?'Corte ⚠️':'Abaixo ❌';
    return `<span style="background:${c}22;color:${c};font-size:9px;font-weight:800;padding:2px 8px;border-radius:10px;white-space:nowrap;">${t}</span>`;
  };
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>#</th><th>Funcionário</th><th>O.S. Atual</th>
          <th>Média/Dia (mês)</th><th>Projeção</th>
          <th>Dias Rest.</th><th>⚡ Média Nec. P.Meta</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((d,i)=>{
          const necColor = d.mediaNecessaria===null?'#7a8798'
            :d.mediaNecessaria<=meta/d.diasUteisMes*1.05?'#1a9c62'
            :d.mediaNecessaria<=d.mediaHistorica*1.5?'#e08a1f':'#d64545';
          const isClickable = typeof selectIndividualFromTable !== 'undefined';
          return `<tr class="clickable" onclick="selectIndividualFromTable('${escapeHtml(d.codKey)}')">
            <td style="color:#7a8798;">${i+1}</td>
            <td><strong>${escapeHtml(d.nome)}</strong></td>
            <td>${fmtNum(d.osAtual)}</td>
            <td>${fmtNum(d.mediaDiaMesAtual,1)}</td>
            <td style="font-weight:700;">${fmtNum(d.projetadoRitmoAtual)}</td>
            <td style="color:${d.diasRestantes<=3?'#d64545':'#123a6b'};font-weight:${d.diasRestantes<=3?'700':'400'};">${d.diasRestantes}</td>
            <td style="font-weight:800;color:${necColor};">${d.mediaNecessaria!==null?fmtNum(d.mediaNecessaria,1):'—'}</td>
            <td>${pill(d.projetadoRitmoAtual)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

/** Acompanhamento Individual: só quem está no quadro atual (independe do filtro da Produção) */
function employeesQuadroAtual(){
  const processed = window.APP_STATE.processed;
  const registry = window.APP_STATE.nameRegistry;
  const atual = window.APP_STATE.currentTeam;
  let codes = uniq(processed.p8460.filter(r=>r.tipoos===58).map(r=>r.codKey));
  if(atual && atual.codes && atual.codes.size) codes = codes.filter(c=>atual.codes.has(c));
  return codes.map(c=>({ codKey:c, nome: registry.get(c)||c })).sort((a,b)=>a.nome.localeCompare(b.nome));
}

function renderIndividual(){
  const pane = $("#pane-individual");
  const all = employeesQuadroAtual();
  // quem foi escolhido antes e saiu do quadro atual deixa de ser selecionado
  if(individualState.codKey && !all.some(e=>e.codKey===individualState.codKey)) individualState.codKey = null;
  const meta = individualState.meta;
  const corte = individualState.linhaDeCorteMes;

  const { rows: resumoTodos, counts, total } = computeResumoTodos(all, meta, corte);

  pane.innerHTML = `
    <div class="panel">
      <div class="panel-header"><h3>Acompanhamento Individual — Selecionar Funcionário</h3></div>
      <div class="toolbar">
        <div class="filter-group" style="flex:2;">
          <label>Funcionário</label>
          <select id="ind-emp-select">
            <option value="">— selecione —</option>
            ${all.map(e=>`<option value="${escapeHtml(e.codKey)}" ${individualState.codKey===e.codKey?'selected':''}>${escapeHtml(e.nome)}</option>`).join("")}
          </select>
        </div>
        <div class="filter-group">
          <label>Meta Mensal (O.S.)</label>
          <input type="number" id="ind-meta" value="${meta}" min="1" style="width:110px;">
        </div>
        <div class="filter-group">
          <label>Linha de Corte (O.S./mês)</label>
          <input type="number" id="ind-corte" value="${corte}" min="1" style="width:110px;">
        </div>
        <button class="btn btn-primary" id="ind-btn-calcular">Ver Detalhe</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Visão Geral — Quadro Atual (${all.length})</h3>
        <div class="panel-actions">
          <span class="panel-note">Meta: ${fmtNum(meta)} O.S. · Corte: ${fmtNum(corte)} O.S. · Ordenado por maior esforço necessário</span>
          <button class="btn btn-outline btn-sm" id="btn-export-individual-pdf">PDF</button>
        </div>
      </div>
      <div id="ind-visao-geral-panel">
        ${buildStatusCountCards(counts, total, meta, corte)}
        <div class="table-wrap">
          ${buildResumoTable(resumoTodos, meta, corte)}
        </div>
      </div>
    </div>

    <div id="ind-resultado"></div>
  `;

  $("#ind-emp-select").addEventListener("change", e=>{ individualState.codKey = e.target.value || null; });
  $("#ind-meta").addEventListener("change", e=>{ individualState.meta = Number(e.target.value)||660; renderIndividual(); });
  $("#ind-corte").addEventListener("change", e=>{ individualState.linhaDeCorteMes = Number(e.target.value)||550; renderIndividual(); });
  $("#ind-btn-calcular").addEventListener("click", ()=>{
    individualState.codKey = $("#ind-emp-select").value || null;
    individualState.meta = Number($("#ind-meta").value)||660;
    individualState.linhaDeCorteMes = Number($("#ind-corte").value)||550;
    renderIndividualResult();
    setTimeout(()=>{ const el=$("#ind-resultado"); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); }, 100);
  });

  $("#btn-export-individual-pdf").addEventListener("click", ()=>{
    Export.toPDFSinglePage(document.getElementById("ind-visao-geral-panel"), "acompanhamento-individual", "landscape");
  });

  if(individualState.codKey) renderIndividualResult();
}

// Clicando numa linha da tabela geral vai direto para o detalhe daquele funcionário
function selectIndividualFromTable(codKey){
  individualState.codKey = codKey;
  const sel = $("#ind-emp-select");
  if(sel) sel.value = codKey;
  renderIndividualResult();
  setTimeout(()=>{ const el=$("#ind-resultado"); if(el) el.scrollIntoView({behavior:"smooth",block:"start"}); }, 100);
}

function renderIndividualResult(){
  const el = $("#ind-resultado");
  if(!el) return;
  if(!individualState.codKey){ el.innerHTML = `<div class="hint-box">Selecione um funcionário acima e clique em <strong>Calcular</strong>.</div>`; return; }

  const d = computeIndividual(individualState.codKey, individualState.meta);
  if(!d){ el.innerHTML = `<div class="warn-box">Sem dados suficientes para este funcionário.</div>`; return; }

  const corte = individualState.linhaDeCorteMes;
  const metaDiaFmt = fmtNum(d.metaDia,1);
  const mediaNecFmt = d.mediaNecessaria !== null ? fmtNum(d.mediaNecessaria,1) : '—';

  // cor para "média necessária": verde se viável (<= 1.5× histórico), laranja se difícil, vermelho se inatingível
  const mediaNecColor = d.mediaNecessaria === null ? '#7a8798'
    : d.mediaNecessaria <= d.metaDia ? '#1a9c62'
    : d.mediaNecessaria <= d.mediaHistorica * 1.5 ? '#e08a1f' : '#d64545';

  // status da linha de corte
  const atingeCorte = d.projetadoRitmoAtual >= corte;
  const atingeMeta = d.projetadoRitmoAtual >= d.meta;

  const statusCard = (label, value, sub, color='#123a6b', bg='#fff') =>
    `<div class="card" style="border-left:4px solid ${color};background:${bg};">
      <div class="card-label">${label}</div>
      <div class="card-value" style="color:${color};">${value}</div>
      ${sub?`<div class="card-sub">${sub}</div>`:''}
    </div>`;

  const tagStatus = (v, meta) => {
    const cor = v >= meta ? '#1a9c62' : v >= corte ? '#e08a1f' : '#d64545';
    const txt = v >= meta ? 'Atingirá a meta' : v >= corte ? 'Acima da linha de corte' : 'Abaixo da linha de corte';
    return `<span style="background:${cor}22;color:${cor};font-size:9.5px;font-weight:800;padding:3px 10px;border-radius:10px;">${txt}</span>`;
  };

  el.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3>${escapeHtml(d.nome)}</h3>
        <span class="panel-note">Referência: ${fmtDateBR(Production.maxDataDate())} · Meta: ${fmtNum(d.meta)} O.S./mês · ${fmtNum(d.metaDia,1)} O.S./dia · Corte: ${fmtNum(corte)}</span>
      </div>

      <div class="cards-grid" style="margin-bottom:16px;">
        ${statusCard("📅 Dias Úteis no Mês", fmtNum(d.diasUteisMes))}
        ${statusCard("✅ Dias Úteis Passados", fmtNum(d.diasCorridosUteis))}
        ${statusCard("⏳ Dias Úteis Restantes", fmtNum(d.diasRestantes), null, d.diasRestantes <= 3 ? '#d64545' : '#123a6b')}
        ${statusCard("📦 O.S. Atual", fmtNum(d.osAtual), `faltam ${fmtNum(Math.max(0,d.osFaltam))} para a meta`)}
        ${statusCard("🎯 Média Diária Necessária", mediaNecFmt+" O.S./dia", d.mediaNecessaria === null ? 'mês encerrado' : d.mediaNecessaria <= d.metaDia ? 'viável ✅' : d.mediaNecessaria <= d.mediaHistorica*1.5 ? 'difícil ⚠️' : 'praticamente inatingível ❌', mediaNecColor)}
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr style="background:#0b2647;">
              <th style="color:#fff;padding:10px 12px;text-align:left;"></th>
              <th style="color:#cfe3fb;padding:10px 12px;text-align:center;">O.S./dia</th>
              <th style="color:#cfe3fb;padding:10px 12px;text-align:center;">Projetado no Mês</th>
              <th style="color:#cfe3fb;padding:10px 12px;text-align:center;">Dif % da Meta</th>
              <th style="color:#cfe3fb;padding:10px 12px;text-align:center;">Dif Qtd O.S.</th>
              <th style="color:#cfe3fb;padding:10px 12px;text-align:center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { label:"Média Dia Mês Atual", media:d.mediaDiaMesAtual, proj:d.projetadoRitmoAtual },
              { label:"Média Dia Histórica", media:d.mediaHistorica, proj:d.projetadoHistorico },
              { label:"Média Dia Semana Anterior", media:d.mediaDiaSemanaAtual, proj:d.projetadoSemana },
            ].map(row=>{
              const dif = d.difPct(row.proj);
              const difQtd = row.proj - d.meta;
              const difColor = difQtd >= 0 ? '#1a9c62' : difQtd >= (corte - d.meta) ? '#e08a1f' : '#d64545';
              return `<tr>
                <td style="font-weight:700;padding:10px 12px;">${row.label}</td>
                <td style="text-align:center;padding:10px 12px;">${fmtNum(row.media,1)}</td>
                <td style="text-align:center;padding:10px 12px;font-weight:700;">${fmtNum(row.proj)}</td>
                <td style="text-align:center;padding:10px 12px;color:${difColor};">${dif!==null?(dif>=0?'+':'')+fmtNum(dif,0)+'%':'—'}</td>
                <td style="text-align:center;padding:10px 12px;color:${difColor};">${(difQtd>=0?'+':'')+fmtNum(difQtd)}</td>
                <td style="text-align:center;padding:10px 12px;">${tagStatus(row.proj, d.meta)}</td>
              </tr>`;
            }).join("")}
            <tr style="background:#f0f4f8;border-top:2px solid #2f6fce;">
              <td style="font-weight:800;color:#123a6b;padding:10px 12px;">🎯 Ideal (Meta)</td>
              <td style="text-align:center;font-weight:800;padding:10px 12px;">${metaDiaFmt}</td>
              <td style="text-align:center;font-weight:800;color:#1a9c62;padding:10px 12px;">${fmtNum(d.meta)}</td>
              <td style="text-align:center;padding:10px 12px;">—</td>
              <td style="text-align:center;padding:10px 12px;">—</td>
              <td style="text-align:center;padding:10px 12px;"><span style="background:#1a9c6222;color:#1a9c62;font-size:9.5px;font-weight:800;padding:3px 10px;border-radius:10px;">Meta</span></td>
            </tr>
            <tr style="background:#fff8e1;">
              <td style="font-weight:800;color:#e08a1f;padding:10px 12px;">⚡ Média Necessária P.Meta</td>
              <td style="text-align:center;font-weight:800;color:${mediaNecColor};padding:10px 12px;">${mediaNecFmt}</td>
              <td colspan="4" style="padding:10px 12px;font-size:12px;color:#7a8798;">
                Para atingir ${fmtNum(d.meta)} O.S. com ${fmtNum(d.diasRestantes)} dias úteis restantes, precisa de <strong style="color:${mediaNecColor};">${mediaNecFmt} O.S./dia</strong> a partir de amanhã.
                ${d.mediaNecessaria !== null && d.mediaNecessaria > d.mediaHistorica * 2 ? '<br><span style="color:#d64545;">⚠️ Mais que o dobro do histórico — meta praticamente inatingível.</span>' : ''}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
        <div style="flex:1;background:#f8fafc;border:1px solid #dde3ea;border-radius:8px;padding:14px 18px;min-width:200px;">
          <div style="font-size:11px;font-weight:700;color:#7a8798;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px;">Linha de Corte (${fmtNum(corte)} O.S./mês)</div>
          <div style="font-size:22px;font-weight:800;color:${atingeCorte?'#1a9c62':'#d64545'};">${atingeCorte?'✅ Acima':'❌ Abaixo'}</div>
          <div style="font-size:11px;color:#7a8798;margin-top:2px;">Projeção atual: ${fmtNum(d.projetadoRitmoAtual)} O.S.</div>
        </div>
        <div style="flex:1;background:#f8fafc;border:1px solid #dde3ea;border-radius:8px;padding:14px 18px;min-width:200px;">
          <div style="font-size:11px;font-weight:700;color:#7a8798;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px;">Meta Mensal (${fmtNum(d.meta)} O.S.)</div>
          <div style="font-size:22px;font-weight:800;color:${atingeMeta?'#1a9c62':'#d64545'};">${atingeMeta?'✅ Atingirá':'❌ Não atingirá'}</div>
          <div style="font-size:11px;color:#7a8798;margin-top:2px;">Faltam ${fmtNum(Math.max(0,d.osFaltam))} O.S. · ${fmtNum(d.diasRestantes)} dia(s) útil(eis)</div>
        </div>
        <div style="flex:2;background:#fff8e1;border:1px solid #f5b400;border-radius:8px;padding:14px 18px;min-width:260px;">
          <div style="font-size:11px;font-weight:700;color:#e08a1f;text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px;">⚡ Média Necessária para a Meta</div>
          <div style="font-size:28px;font-weight:800;color:${mediaNecColor};">${mediaNecFmt} <span style="font-size:14px;font-weight:600;">O.S./dia</span></div>
          <div style="font-size:11px;color:#7a8798;margin-top:2px;">nos próximos ${fmtNum(d.diasRestantes)} dia(s) útil(eis)</div>
        </div>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------------- */
/* MODULE: Turnover (Gestão → Turnover)                                    */
/* ---------------------------------------------------------------------- */
// filtroIni/filtroFim = filtro de período aplicado (controla TODO o painel Turnover:
// indicadores, admissões, desligamentos, transferências, comparações e tabelas).
// null em ambos = usa o padrão (últimos 3 meses), igual ao comportamento anterior.
const TurnoverState = { periodoMeses: 3, filtroIni: null, filtroFim: null, atalhoSel: null, transfIni: null, transfFim: null };

function computeTurnover(){
  const processed = window.APP_STATE.processed;
  const currentTeam = window.APP_STATE.currentTeam;
  const registry = window.APP_STATE.nameRegistry;
  const tv = processed.turnover || [];
  const hoje = Production.maxDataDate() || new Date();

  // --- Ativos no Turnover ---
  const ativos = tv.filter(r=>r.ativo);
  const quadroCadastrado = ativos.length;

  // --- Período de análise ---
  // Controla TODO o painel (indicadores, admissões, desligamentos, transferências,
  // comparações e tabelas). Se o usuário aplicou um filtro de Data Inicial/Data Final,
  // usa exatamente esse intervalo; senão cai no padrão de sempre (últimos 3 meses).
  const filtroAtivo = !!(TurnoverState.filtroIni || TurnoverState.filtroFim);
  const meses = TurnoverState.periodoMeses || 3;
  let periodoIni, periodoFim;
  if(filtroAtivo){
    periodoFim = TurnoverState.filtroFim ? dateOnly(TurnoverState.filtroFim) : dateOnly(hoje);
    periodoIni = TurnoverState.filtroIni ? dateOnly(TurnoverState.filtroIni) : new Date(2000,0,1);
  } else {
    periodoFim = hoje;
    periodoIni = addMonths(new Date(hoje.getFullYear(), hoje.getMonth(), 1), -meses+1);
    periodoIni.setDate(1);
  }

  const noPeriodo = (dt) => dt && dt >= periodoIni && dt <= periodoFim;

  // --- Contratações / Desligamentos / Transferências no período ---
  // Considera transferido quem tiver: TIPO contendo "transfer" (TRANSFERIDO,
  // TRANSFERENCIA etc.) OU a coluna DATA TRANSFERENCIA preenchida — o que vier
  // primeiro já classifica a linha como transferência, mesmo que o TIPO esteja em
  // branco ou com outro texto. Isso conta só no card 🔀 Transferências, nunca em
  // ➖ Desligamentos.
  // Data de referência da transferência: prioriza a coluna DATA TRANSFERENCIA;
  // se não estiver preenchida, cai para DATA DESLIGAMENTO (transferido pra fora do
  // time) e por último DATA CONTRATAÇÃO (funcionário ATIVO=SIM que chegou via
  // transferência e não tem nenhuma das duas outras datas).
  const isTransferencia = r => normStr(r.tipo||"").includes("transfer") || !!r.dtTransf;
  const contratacoes = tv.filter(r=>noPeriodo(r.dtAdm));
  const desligamentos = tv.filter(r=>r.dtDesl && noPeriodo(r.dtDesl) && !isTransferencia(r));
  const transferencias = tv.filter(r=>isTransferencia(r) && noPeriodo(r.dtTransf || r.dtDesl || r.dtAdm));

  // --- Transferências: filtro dedicado por intervalo de datas (independente do
  // período de análise geral) — usa DATA TRANSFERENCIA como referência; ignora
  // linhas sem essa data preenchida.
  const tIni = TurnoverState.transfIni, tFim = TurnoverState.transfFim;
  const transferenciasFiltro = tv.filter(r=>{
    if(!isTransferencia(r) || !r.dtTransf) return false;
    if(tIni && r.dtTransf < dateOnly(tIni)) return false;
    if(tFim && r.dtTransf > dateOnly(tFim)) return false;
    return true;
  }).sort((a,b)=>b.dtTransf-a.dtTransf);

  // --- Quadro médio para Turnover ---
  const quadroInicial = tv.filter(r=>{
    const admAntes = r.dtAdm && r.dtAdm < periodoIni;
    const naoDesligadoAntes = !r.dtDesl || r.dtDesl >= periodoIni;
    return admAntes && naoDesligadoAntes;
  }).length;
  const quadroFinal = ativos.length;
  const quadroMedio = (quadroInicial + quadroFinal) / 2 || 1;

  // --- Turnover % ---
  const turnoverTotal = ((contratacoes.length + desligamentos.length) / 2) / quadroMedio * 100;
  const turnoverEntrada = contratacoes.length / quadroMedio * 100;
  const turnoverSaida = desligamentos.length / quadroMedio * 100;

  // --- Período probatório (90 dias) ---
  const probatorio = ativos.filter(r=>{
    if(!r.dtAdm) return false;
    const diasAdmitido = Math.floor((hoje - r.dtAdm) / 86400000);
    return diasAdmitido < 90;
  }).map(r=>{
    const diasAdmitido = Math.floor((hoje - r.dtAdm) / 86400000);
    const diasRestantes = 90 - diasAdmitido;
    return { ...r, diasAdmitido, diasRestantes };
  });
  const efetivados = ativos.filter(r=>{
    if(!r.dtAdm) return false;
    return Math.floor((hoje - r.dtAdm) / 86400000) >= 90;
  });
  const alertas = probatorio.filter(r=>r.diasRestantes<=10 && r.diasRestantes>5);
  const urgencias = probatorio.filter(r=>r.diasRestantes<=5);

  // --- Revisão de data ---
  const semData = tv.filter(r=>r.dtAdmInvalida);

  // --- Conferência com Chamada ---
  // Usa currentTeam.date (data do último quadro) para comparar, não maxDataDate()
  // que vem com hora (HH:MM:SS) da 8460 e nunca bate com as datas 00:00:00 do quadro.
  const quadroDate = currentTeam.date || dateOnly(hoje);
  const quadroDateMs = dateOnly(quadroDate).getTime();
  const quadroRows = processed.quadro.filter(r=>dateOnly(r.data).getTime()===quadroDateMs);
  const quadroChamada = quadroRows.length;

  // Ativos no Turnover vs Chamada
  const ativosCodKeys = new Set(ativos.filter(r=>r.codKey).map(r=>r.codKey));
  const chamadaCodKeys = new Set(quadroRows.filter(r=>r.codKey).map(r=>r.codKey));

  const noTurnoverNaoChamada = ativos.filter(r=>r.codKey && !chamadaCodKeys.has(r.codKey));
  const naChamadaNaoTurnover = quadroRows.filter(r=>r.codKey && !ativosCodKeys.has(r.codKey));

  const conciliados = ativos.filter(r=>r.codKey && chamadaCodKeys.has(r.codKey)).length;
  const pctConferencia = quadroCadastrado > 0 ? (conciliados / quadroCadastrado * 100) : 100;

  // Presença do dia na chamada
  const scounts = { PRESENTE:0, SEGUNDO_TURNO:0, FALTA:0, FOLGA:0, FERIAS:0, ATESTADO:0 };
  quadroRows.forEach(r=>{ scounts[r.bucket] = (scounts[r.bucket]||0)+1; });

  // Quadro Geral (tabela) — quando o filtro de período está ativo, mostra só quem
  // teve algum evento (admissão, desligamento ou transferência) dentro do intervalo;
  // sem filtro, mostra o cadastro completo (comportamento de sempre).
  const tvFiltrado = filtroAtivo
    ? tv.filter(r => noPeriodo(r.dtAdm) || noPeriodo(r.dtDesl) || noPeriodo(r.dtTransf))
    : tv;

  return {
    hoje, periodoIni, periodoFim, meses, filtroAtivo,
    quadroCadastrado, quadroChamada, quadroInicial, quadroFinal, quadroMedio,
    contratacoes, desligamentos, transferencias, transferenciasFiltro,
    turnoverTotal, turnoverEntrada, turnoverSaida,
    probatorio, efetivados, alertas, urgencias, semData,
    noTurnoverNaoChamada, naChamadaNaoTurnover,
    conciliados, pctConferencia,
    scounts, ativos, tvFiltrado
  };
}

function renderTurnover(){
  const pane = $("#pane-turnover");
  const processed = window.APP_STATE.processed;
  if(!processed.turnoverDispo){
    pane.innerHTML = `<div class="warn-box">A aba <strong>TURNOVER</strong> não foi encontrada no arquivo.<br>
      Adicione uma aba chamada <strong>TURNOVER</strong> com as colunas: <strong>MATRIC, NOME, ATIVO, TIPO, MOTIVO, OBS, DATA CONTRATA, DATA DESLIGAMENTO, DATA TRANSFERENCIA</strong>.</div>`;
    return;
  }

  const d = computeTurnover();
  const hoje = d.hoje;
  const tv = processed.turnover || [];
  const meses = TurnoverState.periodoMeses || 3;

  // ---- helpers visuais ----
  const mc = (label, value, sub='', color='#123a6b', bg='#fff', border='#dde3ea') =>
    `<div style="flex:1;min-width:120px;background:${bg};border:1px solid ${border};border-radius:8px;padding:11px 14px;">
      <div style="font-size:9.5px;font-weight:700;color:#7a8798;text-transform:uppercase;letter-spacing:.3px;margin-bottom:3px;">${label}</div>
      <div style="font-size:22px;font-weight:800;color:${color};line-height:1;">${value}</div>
      ${sub?`<div style="font-size:9.5px;color:#7a8798;margin-top:3px;">${sub}</div>`:''}
    </div>`;

  const pill = (txt, cor) =>
    `<span style="background:${cor}22;color:${cor};font-size:9px;font-weight:800;padding:2px 9px;border-radius:10px;white-space:nowrap;">${txt}</span>`;

  // statusProb — cobre TODOS os funcionários sem exceção
  const statusProb = (r) => {
    if(r.dtAdmInvalida || !r.dtAdm){
      return { tag:'⚠️ Revisar data', cor:'#7a8798', dtEfetivacao: null };
    }
    const diasAdmitido = Math.floor((hoje - r.dtAdm) / 86400000);
    const diasRestantes = 90 - diasAdmitido;
    const dtEfetivacao = new Date(r.dtAdm.getTime() + 90*86400000);

    if(!r.ativo){
      // inativo: só mostra o motivo de saída, sem probatório
      const motivo = r.motivo && normStr(r.motivo).includes('transfer') ? 'Transferido' : 'Desligado';
      return { tag: motivo, cor:'#7a8798', dtEfetivacao, diasAdmitido, diasRestantes };
    }

    // ativo: efetivado ou probatório
    if(diasAdmitido >= 90) return { tag:'✅ Efetivado', cor:'#1a9c62', diasAdmitido, diasRestantes:0, dtEfetivacao };
    if(diasRestantes <= 5)  return { tag:'🚨 Urgência — '+diasRestantes+'d', cor:'#d64545', diasAdmitido, diasRestantes, dtEfetivacao };
    if(diasRestantes <= 10) return { tag:'⚠️ Alerta — '+diasRestantes+'d', cor:'#e08a1f', diasAdmitido, diasRestantes, dtEfetivacao };
    return { tag:'🕐 Probatório — '+diasRestantes+'d rest.', cor:'#2f6fce', diasAdmitido, diasRestantes, dtEfetivacao };
  };

  const corTurnover = d.turnoverTotal<=5?'#1a9c62':d.turnoverTotal<=10?'#e08a1f':'#d64545';
  const statusConf = d.noTurnoverNaoChamada.length===0 && d.naChamadaNaoTurnover.length===0;

  const periodoLabel = d.filtroAtivo
    ? `${fmtDateBR(d.periodoIni)} até ${fmtDateBR(d.periodoFim)}`
    : `Últimos ${meses===1?'30 dias (mês atual)':meses+' meses'} (padrão)`;

  pane.innerHTML = `
    <!-- ======================== FILTRO DE PERÍODO — controla todo o painel ======================== -->
    <div class="panel" style="border:1.5px solid #2f6fce;background:#eff6ff;">
      <div class="panel-header">
        <h3>Filtro de Período</h3>
        <span class="panel-note" style="font-weight:700;color:#123a6b;">Ativo: ${periodoLabel}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
        ${renderAtalhos(TurnoverState.atalhoSel, 'atalhoTurnover', ['mes_atual','mes_ant','ultimos_3m','ano_atual','ano_ant','tudo'])}
      </div>
      <div class="toolbar" style="margin-bottom:0;">
        <div class="filter-group"><label>Data Inicial</label><input type="date" id="tv-filtro-ini" value="${TurnoverState.filtroIni?toInputDate(TurnoverState.filtroIni):''}"></div>
        <div class="filter-group"><label>Data Final</label><input type="date" id="tv-filtro-fim" value="${TurnoverState.filtroFim?toInputDate(TurnoverState.filtroFim):''}"></div>
        <div class="spacer"></div>
        <button class="btn btn-outline btn-sm" id="tv-filtro-limpar">Limpar filtro</button>
        <button class="btn btn-primary btn-sm" id="tv-filtro-aplicar">Aplicar filtro</button>
      </div>
    </div>

    <!-- ======================== RESUMO + CARDS ======================== -->
    <div class="panel">
      <div class="panel-header">
        <h3>Turnover — Painel de Controle</h3>
        <div class="panel-actions">
          <label style="font-size:11px;color:#7a8798;">Período de análise:</label>
          <select id="tv-periodo-select" style="font-size:12px;padding:4px 8px;border:1px solid #dde3ea;border-radius:6px;">
            <option value="1" ${meses===1?'selected':''}>Mês atual</option>
            <option value="3" ${meses===3?'selected':''}>Últimos 3 meses</option>
            <option value="6" ${meses===6?'selected':''}>Últimos 6 meses</option>
            <option value="12" ${meses===12?'selected':''}>Últimos 12 meses</option>
          </select>
        </div>
      </div>

      <!-- linha 1: quadro + chamada + turnover -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        ${mc('👥 Quadro Ativo', d.quadroCadastrado, 'ATIVO = SIM na sheet')}
        ${mc('➕ Contratações', d.contratacoes.length, 'no período')}
        ${mc('➖ Desligamentos', d.desligamentos.length, 'excl. transferências', '#d64545','#fef2f2','#d64545')}
        ${mc('🔀 Transferências', d.transferencias.length, 'para outro setor', '#2f6fce','#eff6ff','#2f6fce')}
        <div style="flex:1;min-width:140px;background:#0b2647;border-radius:8px;padding:11px 14px;">
          <div style="font-size:9.5px;font-weight:700;color:#9db8dd;text-transform:uppercase;letter-spacing:.3px;margin-bottom:3px;">Turnover Total</div>
          <div style="font-size:26px;font-weight:800;color:${corTurnover};line-height:1;">${fmtNum(d.turnoverTotal,1)}%</div>
          <div style="font-size:9.5px;color:#9db8dd;margin-top:3px;">Entrada: ${fmtNum(d.turnoverEntrada,1)}% · Saída: ${fmtNum(d.turnoverSaida,1)}%</div>
        </div>
      </div>

      <!-- linha 2: probatório -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        ${mc('⏳ Prob. Ativos', d.probatorio.length, 'dentro dos 90 dias')}
        ${mc('✅ Efetivados', d.efetivados.length, 'completaram 90 dias', '#1a9c62','#f0fdf4','#1a9c62')}
        ${mc('⚠️ Alerta (≤10d)', d.alertas.length, 'até vencer os 90 dias', d.alertas.length?'#e08a1f':'#7a8798', d.alertas.length?'#fffbeb':'#fff', d.alertas.length?'#e08a1f':'#dde3ea')}
        ${mc('🚨 Urgência (≤5d)', d.urgencias.length, 'decisão urgente', d.urgencias.length?'#d64545':'#7a8798', d.urgencias.length?'#fef2f2':'#fff', d.urgencias.length?'#d64545':'#dde3ea')}
        ${mc('📊 Conferência', fmtNum(d.pctConferencia,1)+'%', statusConf?'✅ Quadro conferido':'⚠️ Divergência', statusConf?'#1a9c62':'#e08a1f', statusConf?'#f0fdf4':'#fffbeb', statusConf?'#1a9c62':'#e08a1f')}
      </div>

      ${d.semData.length ? `<div class="warn-box">⚠️ ${d.semData.length} funcionário(s) com <strong>data de admissão inválida (00/01/1900)</strong> — revise no arquivo: ${d.semData.map(r=>`<strong>${escapeHtml(r.nome)}</strong>`).join(', ')}</div>` : ''}
      ${d.urgencias.length ? `<div class="warn-box" style="background:#fef2f2;border-color:#d64545;color:#b91c1c;">🚨 Decisão urgente: <strong>${d.urgencias.map(r=>escapeHtml(r.nome)).join(' · ')}</strong> — 5 dias ou menos para vencer o período probatório!</div>` : ''}
      ${!statusConf ? `<div class="warn-box">⚠️ ATENÇÃO: O quadro da Reposição não está 100% conciliado com a chamada. ${d.noTurnoverNaoChamada.length} no Turnover sem chamada · ${d.naChamadaNaoTurnover.length} na chamada sem Turnover.</div>` : ''}
    </div>

    <!-- ======================== TRANSFERÊNCIAS — DETALHAMENTO ======================== -->
    <div class="panel">
      <div class="panel-header">
        <h3>Transferências — Detalhamento</h3>
        <span class="panel-note">Filtra por DATA TRANSFERENCIA · independente do período de análise acima</span>
      </div>
      <div class="toolbar" style="margin-bottom:10px;">
        <div class="filter-group"><label>Data Início</label><input type="date" id="tv-transf-ini" value="${TurnoverState.transfIni?toInputDate(TurnoverState.transfIni):''}"></div>
        <div class="filter-group"><label>Data Fim</label><input type="date" id="tv-transf-fim" value="${TurnoverState.transfFim?toInputDate(TurnoverState.transfFim):''}"></div>
        <div class="spacer"></div>
        <button class="btn btn-outline btn-sm" id="tv-transf-clear">Limpar</button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Matrícula</th><th>Nome</th><th>Data Transferência</th><th>Tipo</th><th>Ativo</th></tr></thead>
          <tbody>
            ${d.transferenciasFiltro.length ? d.transferenciasFiltro.map(r=>`
              <tr>
                <td>${escapeHtml(r.matric||'—')}</td>
                <td><strong>${escapeHtml(r.nome||'—')}</strong></td>
                <td>${fmtDateBR(r.dtTransf)}</td>
                <td>${escapeHtml(r.tipo||'—')}</td>
                <td>${r.ativo?'✅ Sim':'❌ Não'}</td>
              </tr>`).join('') : `<tr><td colspan="5" style="text-align:center;color:#7a8798;padding:14px;">${TurnoverState.transfIni||TurnoverState.transfFim ? 'Nenhuma transferência no intervalo selecionado.' : 'Nenhum registro com DATA TRANSFERENCIA preenchida.'}</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================== TABELA GERAL ======================== -->
    <div class="panel">
      <div class="panel-header">
        <h3>Quadro Geral — ${d.filtroAtivo?'Funcionários com Evento no Período':'Todos os Funcionários'}</h3>
        <span class="panel-note">${d.tvFiltrado.length} registro(s)${d.filtroAtivo?' no período filtrado':''} · ${d.quadroCadastrado} ativos no total</span>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Ativo</th>
              <th>Tipo / Motivo</th>
              <th>Data Contratação</th>
              <th>Data Desligamento</th>
              <th>Data Efetivação (virtual)</th>
              <th>⏳ Período Probatório</th>
              <th>Obs</th>
            </tr>
          </thead>
          <tbody>
            ${d.tvFiltrado.map(r=>{
              const prob = statusProb(r);

              // Data contratação
              const celAdm = r.dtAdmInvalida
                ? `<span style="color:#e08a1f;font-weight:700;">Revisar data contratação</span>`
                : r.dtAdm ? fmtDateBR(r.dtAdm) : '—';

              // Data efetivação virtual (D.Contratação + 90d) — para todos com data válida
              const celEfet = prob && prob.dtEfetivacao
                ? (r.ativo && prob.diasAdmitido>=90
                    ? `<strong style="color:#1a9c62;">${fmtDateBR(prob.dtEfetivacao)}</strong>`
                    : `<span style="color:#7a8798;">${fmtDateBR(prob.dtEfetivacao)}</span>`)
                : '—';

              // Célula de status probatório — sempre preenchida
              const celProb = prob ? pill(prob.tag, prob.cor) : '—';

              return `<tr>
                <td style="font-weight:700;color:#2f6fce;">${escapeHtml(r.matric||'—')}</td>
                <td><strong>${escapeHtml(r.nome)}</strong></td>
                <td><span style="color:${r.ativo?'#1a9c62':'#7a8798'};font-weight:700;">${r.ativo?'SIM':'NÃO'}</span></td>
                <td>${escapeHtml((r.tipo?r.tipo+(r.motivo?' · ':''):'')+''+(r.motivo||''))||'—'}</td>
                <td>${celAdm}</td>
                <td>${r.dtDesl?fmtDateBR(r.dtDesl):'—'}</td>
                <td style="font-size:11px;">${celEfet}</td>
                <td>${celProb}</td>
                <td style="font-size:11px;color:#7a8798;">${escapeHtml(r.obs||'—')}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================== CONFERÊNCIA ======================== -->
    ${d.noTurnoverNaoChamada.length || d.naChamadaNaoTurnover.length ? `
    <div class="panel">
      <div class="panel-header"><h3>Conferência — Turnover × Chamada</h3></div>
      ${d.noTurnoverNaoChamada.length ? `
        <div style="font-size:12px;font-weight:700;color:#d64545;margin-bottom:6px;">❌ Ativo no Turnover mas NÃO encontrado na Chamada (${d.noTurnoverNaoChamada.length})</div>
        <div class="table-wrap" style="margin-bottom:14px;">
          <table class="data-table"><thead><tr><th>Matrícula</th><th>Nome</th><th>Admissão</th><th>Situação</th></tr></thead>
          <tbody>${d.noTurnoverNaoChamada.map(r=>`<tr>
            <td>${escapeHtml(r.matric||'—')}</td><td><strong>${escapeHtml(r.nome)}</strong></td>
            <td>${r.dtAdm?fmtDateBR(r.dtAdm):'<span style="color:#e08a1f;">Revisar data</span>'}</td>
            <td>${pill('Não localizado na Chamada','#d64545')}</td>
          </tr>`).join('')}</tbody></table>
        </div>` : ''}
      ${d.naChamadaNaoTurnover.length ? `
        <div style="font-size:12px;font-weight:700;color:#e08a1f;margin-bottom:6px;">⚠️ Na Chamada mas NÃO encontrado no Turnover (${d.naChamadaNaoTurnover.length})</div>
        <div class="table-wrap">
          <table class="data-table"><thead><tr><th>Matrícula</th><th>Nome</th><th>Status Chamada</th><th>Situação</th></tr></thead>
          <tbody>${d.naChamadaNaoTurnover.map(r=>{
            const registry = window.APP_STATE.nameRegistry;
            return `<tr>
              <td>${escapeHtml(r.codigo||r.codKey||'—')}</td>
              <td><strong>${escapeHtml(registry.get(r.codKey)||r.nome||'—')}</strong></td>
              <td>${escapeHtml(r.statusRaw||r.bucket||'—')}</td>
              <td>${pill('Não localizado no Turnover','#e08a1f')}</td>
            </tr>`;
          }).join('')}</tbody></table>
        </div>` : ''}
    </div>` : ''}
  `;

  const tvFiltroAplicar = document.getElementById("tv-filtro-aplicar");
  const tvFiltroLimpar = document.getElementById("tv-filtro-limpar");
  if(tvFiltroAplicar) tvFiltroAplicar.addEventListener("click", ()=>{
    const iniVal = document.getElementById("tv-filtro-ini").value;
    const fimVal = document.getElementById("tv-filtro-fim").value;
    TurnoverState.filtroIni = iniVal ? new Date(iniVal+"T00:00:00") : null;
    TurnoverState.filtroFim = fimVal ? new Date(fimVal+"T00:00:00") : null;
    TurnoverState.atalhoSel = null;
    renderTurnover();
  });
  if(tvFiltroLimpar) tvFiltroLimpar.addEventListener("click", ()=>{
    TurnoverState.filtroIni = null; TurnoverState.filtroFim = null; TurnoverState.atalhoSel = null;
    renderTurnover();
  });

  const tvTransfIni = document.getElementById("tv-transf-ini");
  const tvTransfFim = document.getElementById("tv-transf-fim");
  const tvTransfClear = document.getElementById("tv-transf-clear");
  if(tvTransfIni) tvTransfIni.addEventListener("change", e=>{
    TurnoverState.transfIni = e.target.value ? new Date(e.target.value+"T00:00:00") : null;
    renderTurnover();
  });
  if(tvTransfFim) tvTransfFim.addEventListener("change", e=>{
    TurnoverState.transfFim = e.target.value ? new Date(e.target.value+"T00:00:00") : null;
    renderTurnover();
  });
  if(tvTransfClear) tvTransfClear.addEventListener("click", ()=>{
    TurnoverState.transfIni = null; TurnoverState.transfFim = null;
    renderTurnover();
  });
}

/* ---------------------------------------------------------------------- */
/* MODULE: Férias (Gestão → Férias)                                       */
/* ---------------------------------------------------------------------- */
// Regra: data de admissão + 12 meses = fecha o período aquisitivo (1 ano de casa).
// As férias são programadas para o mês seguinte ao aniversário, ou seja,
// dataFerias = admissão + 13 meses. O ciclo se repete a cada 12 meses depois
// disso (aniversário seguinte também gera direito a novas férias).
const FeriasState = { filtro: null }; // filtro: null=todos, ou um dos ids de bucket

function computeFerias(){
  const processed = window.APP_STATE.processed;
  const tv = processed.turnover || [];
  const hoje = Production.maxDataDate() || new Date();
  const hojeReal = dateOnly(new Date());
  const agend = (processed.feriasAgendadas||[]).filter(f=>!f.cancelada);

  const ativos = tv.filter(r=>r.ativo && r.dtAdm);

  const linhas = ativos.map(r=>{
    // primeira data de férias do ciclo: admissão + 13 meses
    let dataFerias = addMonths(r.dtAdm, 13);
    // Dedução de ciclos já tirados: se o ciclo está vencido há mais de 4 meses (120 dias),
    // presume-se que o funcionário já tirou essas férias (mesmo sem registro), e avança
    // pro próximo ciclo (+12 meses). Repete em cascata pra cada ano — assim alguém com
    // vários anos de casa "pula" automaticamente todos os ciclos antigos presumidos como
    // já tirados, e para exatamente no ciclo vigente a partir do ano atual.
    // Ex.: admissão 11/09/2019 → ciclos 2020..2025 todos vencidos há mais de 4 meses →
    // presume-se tirados → para no ciclo 2026 (11/10/2026), ainda não vencido.
    while((hoje - dataFerias) / 86400000 > 120){ dataFerias = addMonths(dataFerias, 12); }

    // férias lançadas em Lançamentos > Lançar Férias mandam no status: quem está de férias (ou já tem
    // férias marcadas) não é "vencido" — a situação está em vigor / resolvida.
    const k = r.matric ? normStr(String(r.matric)) : null;
    const mine = k ? agend.filter(f=>f.codKey===k) : [];
    // lançamentos deste ciclo: começam de ~5 meses antes até ~11 meses depois da data prevista
    const doCiclo = ()=> mine.filter(f=>{ const di = (dateOnly(f.ini) - dateOnly(dataFerias)) / 86400000; return di >= -150 && di <= 330; });
    let lanc = doCiclo();
    // 30 dias ou mais já gozados neste ciclo → o ciclo está cumprido; vale o próximo
    if(lanc.filter(f=>dateOnly(f.fim) < hojeReal).reduce((n,f)=>n+(f.dias||0),0) >= 30){ dataFerias = addMonths(dataFerias, 12); lanc = doCiclo(); }
    const emGozo = lanc.find(f=> dateOnly(f.ini) <= hojeReal && dateOnly(f.fim) >= hojeReal);
    const futura = lanc.filter(f=> dateOnly(f.ini) > hojeReal).sort((x,y)=> x.ini - y.ini)[0];

    let diffDias = Math.round((dataFerias - hoje) / 86400000);
    let bucket, bucketLabel, cor;
    if(emGozo){ bucket='emgozo'; bucketLabel='🏖️ Em férias'; cor='#7a3fc4'; diffDias = Math.round((dateOnly(emGozo.fim) - hojeReal) / 86400000) + 1; }
    else if(futura){ bucket='agendada'; bucketLabel='📅 Agendada'; cor='#7a3fc4'; diffDias = Math.round((dateOnly(futura.ini) - hojeReal) / 86400000); }
    else if(diffDias < 0){ bucket='vencida'; bucketLabel='🚨 Vencida'; cor='#d64545'; }
    else if(diffDias <= 90){ bucket='prox3'; bucketLabel='⏰ Próx. 3 meses'; cor='#e08a1f'; }
    else if(diffDias <= 180){ bucket='ate6'; bucketLabel='🕐 Até 6 meses'; cor='#c99a1f'; }
    else if(diffDias <= 270){ bucket='ate9'; bucketLabel='📅 Até 9 meses'; cor='#2f6fce'; }
    else { bucket='mais9'; bucketLabel='✅ +9 meses'; cor='#1a9c62'; }

    return { ...r, dataFerias, diffDias, bucket, bucketLabel, cor };
  }).sort((a,b)=>{
    const fim = x=> (x.bucket==='emgozo' || x.bucket==='agendada') ? 100000 : 0;   // em férias / agendadas: depois das pendências
    return (fim(a) + a.diffDias) - (fim(b) + b.diffDias);
  });

  const counts = { vencida:0, emgozo:0, agendada:0, prox3:0, ate6:0, ate9:0, mais9:0 };
  linhas.forEach(l=>{ counts[l.bucket] = (counts[l.bucket]||0)+1; });

  const semData = tv.filter(r=>r.ativo && !r.dtAdm);

  return { hoje, linhas, counts, semData, total: linhas.length };
}

function renderFerias(){
  const pane = $("#pane-ferias");
  const processed = window.APP_STATE.processed;
  if(!processed.turnoverDispo){
    pane.innerHTML = `<div class="warn-box">A aba <strong>TURNOVER</strong> não foi encontrada no arquivo.<br>
      Adicione uma aba chamada <strong>TURNOVER</strong> com as colunas: <strong>MATRIC, NOME, ATIVO, TIPO, MOTIVO, OBS, DATA CONTRATA, DATA DESLIGAMENTO, DATA TRANSFERENCIA</strong> para calcular as férias.</div>`;
    return;
  }

  const d = computeFerias();

  const mc = (id, label, value, cor, ativo) =>
    `<div onclick="FeriasState.filtro=FeriasState.filtro==='${id}'?null:'${id}';renderFerias();"
      style="flex:1;min-width:130px;cursor:pointer;background:${ativo?cor+'15':'#fff'};border:1.5px solid ${ativo?cor:'#dde3ea'};border-radius:8px;padding:11px 14px;transition:.15s;">
      <div style="font-size:9.5px;font-weight:700;color:#7a8798;text-transform:uppercase;letter-spacing:.3px;margin-bottom:3px;">${label}</div>
      <div style="font-size:24px;font-weight:800;color:${cor};line-height:1;">${value}</div>
    </div>`;

  const pill = (txt, cor) =>
    `<span style="background:${cor}22;color:${cor};font-size:9px;font-weight:800;padding:2px 9px;border-radius:10px;white-space:nowrap;">${txt}</span>`;

  const linhasFiltradas = FeriasState.filtro ? d.linhas.filter(l=>l.bucket===FeriasState.filtro) : d.linhas;

  // férias lançadas em Lançamentos > Lançar Férias (aba FÉRIAS AGENDADAS)
  const hojeF = dateOnly(new Date());
  const agend = (processed.feriasAgendadas||[]).filter(f=>!f.cancelada);
  const feriasDe = (l)=>{
    const k = l.matric ? normStr(String(l.matric)) : null;
    const mine = k ? agend.filter(f=>f.codKey===k) : [];
    const prox = mine.filter(f=>dateOnly(f.fim)>=hojeF).sort((a,b)=>a.ini-b.ini)[0] || null;
    const tiradas = mine.filter(f=>dateOnly(f.fim)<hojeF).reduce((n,f)=>n+(f.dias||0),0);
    return { prox, tiradas };
  };
  const conflitosF = window.FeedbackAdv ? FeedbackAdv.feriasConflitos() : [];
  const avisoConflito = conflitosF.length ? `<div class="warn-box" style="margin-top:10px;">⚠️ <strong>Férias no mesmo período:</strong><ul style="margin:6px 0 0 18px;padding:0">${conflitosF.map(g=>`<li>${escapeHtml(g.a.nome)} (${fmtDateBR(g.a.ini)} a ${fmtDateBR(g.a.fim)}) × ${escapeHtml(g.b.nome)} (${fmtDateBR(g.b.ini)} a ${fmtDateBR(g.b.fim)})</li>`).join("")}</ul></div>` : "";

  pane.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <h3>Férias — Painel de Controle</h3>
        <span class="panel-note">Cálculo: Data de Contratação + 12 meses (fecha 1 ano) → férias programadas para o mês seguinte · ciclo se repete a cada 12 meses · ciclos vencidos há mais de 4 meses são presumidos como já tirados e avançam pro próximo ano</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${mc('vencida','Vencidas', d.counts.vencida, '#d64545', FeriasState.filtro==='vencida')}
        ${mc('emgozo','Em férias', d.counts.emgozo, '#7a3fc4', FeriasState.filtro==='emgozo')}
        ${mc('agendada','Agendadas', d.counts.agendada, '#7a3fc4', FeriasState.filtro==='agendada')}
        ${mc('prox3','Próximas 3 meses', d.counts.prox3, '#e08a1f', FeriasState.filtro==='prox3')}
        ${mc('ate6','Até 6 meses', d.counts.ate6, '#c99a1f', FeriasState.filtro==='ate6')}
        ${mc('ate9','Até 9 meses', d.counts.ate9, '#2f6fce', FeriasState.filtro==='ate9')}
        ${mc('mais9','+9 meses', d.counts.mais9, '#1a9c62', FeriasState.filtro==='mais9')}
      </div>
      ${avisoConflito}
      ${d.semData.length ? `<div class="warn-box" style="margin-top:10px;">⚠️ ${d.semData.length} funcionário(s) ativo(s) sem <strong>Data de Contratação</strong> válida no TURNOVER — não entram no cálculo. Revise a planilha.</div>` : ''}
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Funcionários ${FeriasState.filtro ? '— filtro: '+escapeHtml(d.linhas.find(l=>l.bucket===FeriasState.filtro)?.bucketLabel||'') : '(todos)'}</h3>
        <span class="panel-note">${linhasFiltradas.length} de ${d.total} · ordenado por urgência (vencidas primeiro; em férias e agendadas por último)</span>
        ${FeriasState.filtro ? `<button onclick="FeriasState.filtro=null;renderFerias();" style="padding:5px 12px;font-size:11px;font-weight:700;border-radius:6px;border:1.5px solid #7a8798;background:#fff;color:#7a8798;cursor:pointer;">Limpar filtro</button>` : ''}
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Matríc.</th><th>Nome</th><th>Tipo</th>
            <th>Data Contratação</th><th>Férias Previstas</th>
            <th>Status</th><th>Dias</th><th>Férias agendadas</th><th>Dias já tirados (lançados)</th>
          </tr></thead>
          <tbody>
            ${linhasFiltradas.length ? linhasFiltradas.map(l=>{ const fx = feriasDe(l); return `
              <tr>
                <td style="font-size:10px;color:#7a8798;">${escapeHtml(l.matric||'—')}</td>
                <td><strong>${escapeHtml(l.nome||'—')}</strong></td>
                <td style="font-size:10px;">${escapeHtml(l.tipo||'—')}</td>
                <td>${fmtDateBR(l.dtAdm)}</td>
                <td style="font-weight:700;color:${l.cor};">${fmtDateBR(l.dataFerias)}</td>
                <td>${pill(l.bucketLabel, l.cor)}</td>
                <td style="text-align:right;color:${l.cor};font-weight:700;">${l.bucket==='emgozo' ? ('volta em '+l.diffDias+'d') : l.bucket==='agendada' ? ('começa em '+l.diffDias+'d') : l.diffDias<0 ? (Math.abs(l.diffDias)+'d vencida') : (l.diffDias+'d')}</td>
                <td>${fx.prox ? `<strong style="color:#7a3fc4">${fmtDateBR(fx.prox.ini)} a ${fmtDateBR(fx.prox.fim)}</strong> <span class="small-muted">(${fx.prox.dias}d)</span>` : '<span class="small-muted">não agendada</span>'}</td>
                <td style="text-align:right">${fx.tiradas||'—'}</td>
              </tr>`; }).join('') : `<tr><td colspan="9" style="text-align:center;color:#7a8798;padding:16px;">Nenhum funcionário neste filtro.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------------- */
/* MODULE: Avaria XML (Indicadores → Avaria XML)                          */
/* ---------------------------------------------------------------------- */
const AvState = {
  notas: [],        // todas as notas parsed
  filtro: { ini: null, fim: null, categoria: null, busca: '' },
  detalheNota: null,
  alertas: [],
  CNPJ_ESPERADO: '15464658000202'
};

// ---- Normalização de motivos baseada nos XMLs reais analisados ----
// Estado global do toggle TF Comprador → Avaria
// Default: somar TF Comprador à Avaria (toggle pode separar)
if(window.avTFCompradorEmAvaria === undefined) window.avTFCompradorEmAvaria = true;

// Helper: normaliza string para comparação tolerante a typos
function avNorm(s){ return (s||'').toUpperCase().replace(/\s+/g,' ').trim(); }

// Detecta se o texto contém "BAIXA TF" (com typos comuns: BAXA, BAIKA, BAI XA...)
function avIsBaixaTF(t){
  return /B[AI][AI]?X?A\s*T[EF]/.test(t) || /BAIXA\s*T[EF]/.test(t) || /BAXA\s*T[EF]/.test(t);
}

// TF da LOJA/STO (Avaria pura — sempre)
function avIsTFLoja(t){
  if(avIsBaixaTF(t) && /STO|LOJA/.test(t)) return true;   // BAIXA TF LOJA STO
  if(/LOJA\s*T[EF]/.test(t)) return true;                 // BAIXA LOJA TF - STO
  if(/T[EF]\s*[-–]?\s*STO/.test(t)) return true;          // TF - STO
  return false;
}

// TF Comprador — tem nome próprio OU palavra COMPRADOR após TF (sem STO/LOJA)
// Exemplos: BAIXA TF ANDRE, BAIXA TF - RODRIGO, TF COMPRADOR, AVARIA TF WESLEY, BAIXA TF RODRIGO - 2137
function avIsTFComprador(t){
  if(avIsTFLoja(t)) return false;  // loja tem prioridade absoluta
  // deve ter TF mencionado (com ou sem BAIXA/AVARIA antes)
  const temTF = avIsBaixaTF(t) ||
                /\bAVARIA\s+T[EF]\b/.test(t) ||
                /\bT[EF]\b/.test(t);
  if(!temTF) return false;
  // tem COMPRADOR explícito
  if(/T[EF]\s*[-–]?\s*COMP/.test(t)) return true;
  // tem nome (2+ letras) após TF separado por hífen
  if(/T[EF]\s*[-–]\s*[A-Z]{2}/.test(t)) return true;   // BAIXA TF - ANDRE
  // tem nome após TF sem hífen, excluindo palavras reservadas de loja
  if(/T[EF]\s+[A-Z][A-Z]/.test(t) && !/T[EF]\s+(LOJA|STO|STORE|DE|DO|DA|EM|BAXA|BAIXA)\b/.test(t)) return true;
  // número de matrícula após TF (BAIXA TF RODRIGO- 2137)
  if(/T[EF]\s+\w+\s*[-–]\s*\d+/.test(t) && !/T[EF]\s+(LOJA|STO)/.test(t)) return true;
  return false;
}

// TF genérico (sem loja nem comprador identificado) → Avaria por padrão
function avIsTF(t){
  return avIsBaixaTF(t) || avIsTFLoja(t) || avIsTFComprador(t) ||
         (/\bT[EF]\b/.test(t) && /LOJA|STO|BAIXA|BAXA/.test(t));
}

// Detecta variações de Cozinha — inclui COZINNHA, COZIMHA, CUZINHA, CUZINNHA...
function avIsCozinha(t){
  return /C[OU]Z[INHA]{2,}/.test(t) || /USO\s*COZ/.test(t);
}

// Detecta variações de VALE com typos
function avIsVale(t){
  return /V[AE]L[EI]/.test(t);
}

// Detecta COMPRA DE FUNCIONÁRIO / MOTORISTA com todos os typos documentados
function avIsCompraFuncionario(t){
  // "NOTA DE FUNCIONARIO/MOTORISTA" sem COMPRA explícita
  if(/NOTA\s+DE\s+(FUNC|FUI?N?C|FUC)/.test(t) && !/LOJA|STO/.test(t)) return true;
  if(/NOTA\s+DE\s+MOTORISTA/.test(t)) return true;
  // COMPRA (e typos) + destinatário (FUNCIONARIO com typos, MOTORISTA, etc.)
  const temCompra = /COM[NP]?[NP]?R[AD][AO]?/.test(t) && /COM/.test(t);
  if(!temCompra) return false;
  // destinatário: FUNCIONARIO (e variações) ou MOTORISTA
  const temDestinatario =
    /FU[BI]?[IN]?[CN][CI]?[OA][AN][AO]?[RD][IO][AO]?/.test(t) || // FUNCIONARIO e typos
    /FU[AC]?CION/.test(t)    ||  // FUCIONARIO, FUACIONARIO
    /FUI?N?CION/.test(t)     ||  // FUINCIONARIO
    /FUNCIOAN/.test(t)       ||  // FUNCIOANRIO (letras trocadas)
    /FUN[BC]CION/.test(t)    ||  // FUNBCIONARIO
    /MOTORISTA/.test(t)      ||  // NOTA DE COMPRA DE MOTORISTA
    /FUNCIONA/.test(t);          // qualquer que comece com FUNCIONA
  return temDestinatario;
}

// Função principal — TF Comprador separado ou junto com Avaria conforme toggle
function avNormalizarCategoria(textoOriginal) {
  if(!textoOriginal) return 'Outros';
  const t = avNorm(textoOriginal);

  // 1. Vale (primeiro — "VALE MOTORISTA (AVARIA)" deve ir para Vales)
  if(avIsVale(t)) return 'Vales';

  // 2. Compra / Nota de Funcionário → Vales
  if(avIsCompraFuncionario(t)) return 'Vales';

  // 3. TF Comprador ANTES do TF genérico — toggle decide destino
  if(avIsTFComprador(t)){
    return window.avTFCompradorEmAvaria ? 'Avaria' : 'Baixa TF Comprador';
  }

  // 4. TF Loja / genérico → sempre Avaria
  if(avIsTFLoja(t) || avIsBaixaTF(t)) return 'Avaria';

  // 5. Baixa Cozinha (e variações)
  if(avIsCozinha(t)) return 'Baixa Cozinha';

  // 6. Avaria explícita
  if(/AVARIA/.test(t)) return 'Avaria';

  // 7. Outras Baixas genéricas
  if(/BA[IX]+A/.test(t)) return 'Baixa Estoque';

  return 'Outros';
}

// ---- Detecta se uma linha do infCpl é o motivo principal vs info técnica/nome ----
function avIsLinhaMotivo(linha) {
  const t = linha.trim().toUpperCase();
  if(!t) return false;
  if(/^BASE ST BCR/.test(t)) return false;
  if(/^VALOR TOTAL DO IPI/.test(t)) return false;
  if(/^ICMS\s+\d/.test(t)) return false;   // ex: ICMS 29% CONF...
  // linha de identificação de pessoa (matrícula - nome ou nome - matrícula)
  if(/^\d{4,}\s*[-–]\s*[A-Z]/.test(t)) return false;
  if(/^[A-Z].+[-–]\s*\d{3,}/.test(t) && !/BAIXA|VALE|NOTA|AVARIA|COMPRA/.test(t)) return false;
  if(/^REF:\s*\d/.test(t)) return false;
  if(/^VW\s*[-–]/.test(t)) return false;    // apelido de funcionário
  if(/^APJR\s*[-–]/.test(t)) return false;
  if(/^DGIRO\s*[-–]/.test(t)) return false;
  return true;
}

function avExtrairMotivo(infCplTxt) {
  if(!infCplTxt) return { motivo: '', categoria: 'Outros', linhas: [] };
  const partes = infCplTxt.split('//').map(p=>p.trim()).filter(Boolean);
  const linhasMotivo = partes.filter(avIsLinhaMotivo);
  const motivo = linhasMotivo[0] || '';
  return { motivo, categoria: avNormalizarCategoria(motivo), linhas: partes };
}

// ---- Parser principal de um XML NF-e ----
function avParseXML(xmlStr, nomeArquivo) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');
    const parseErr = doc.querySelector('parsererror');
    if(parseErr) throw new Error('XML inválido: ' + parseErr.textContent.slice(0,100));

    const ns = 'http://www.portalfiscal.inf.br/nfe';
    const g = (parent, ...tags) => {
      let cur = parent;
      for(const tag of tags){
        if(!cur) return null;
        cur = cur.querySelector(`:scope > ${tag}`) || cur.getElementsByTagNameNS(ns, tag)[0] || null;
      }
      return cur;
    };
    const gv = (parent, ...tags) => { const el = g(parent, ...tags); return el ? (el.textContent||'').trim() : ''; };

    const nfe    = doc.getElementsByTagNameNS(ns,'NFe')[0];
    const inf    = nfe?.getElementsByTagNameNS(ns,'infNFe')[0];
    if(!inf) throw new Error('infNFe não encontrado');

    const ide    = inf.getElementsByTagNameNS(ns,'ide')[0];
    const emit   = inf.getElementsByTagNameNS(ns,'emit')[0];
    const infad  = inf.getElementsByTagNameNS(ns,'infAdic')[0];
    const tot    = inf.getElementsByTagNameNS(ns,'total')[0];
    const ictot  = tot?.getElementsByTagNameNS(ns,'ICMSTot')[0];

    // Validação CNPJ
    const cnpjEmit = gv(emit,'CNPJ');
    const cnpjDivergente = cnpjEmit !== AvState.CNPJ_ESPERADO;

    // Dados da nota
    const nNF   = gv(ide,'nNF');
    const serie = gv(ide,'serie');
    const dhEmi = gv(ide,'dhEmi');
    const natOp = gv(ide,'natOp');

    // Data de emissão → Date
    let dtEmissao = null;
    if(dhEmi) { try { dtEmissao = new Date(dhEmi); } catch(e){} }

    // infAdic / infCpl
    const infCplTxt = gv(infad,'infCpl') || (infad ? (infad.textContent||'').trim() : '');
    const { motivo, categoria } = avExtrairMotivo(infCplTxt);

    // Totais da nota
    const fv = (el, tag) => parseFloat(gv(el, tag)||'0') || 0;
    const vProd   = fv(ictot,'vProd');
    const vDesc   = fv(ictot,'vDesc');
    const vFrete  = fv(ictot,'vFrete');
    const vSeg    = fv(ictot,'vSeg');
    const vOutro  = fv(ictot,'vOutro');
    const vIPI    = fv(ictot,'vIPI');
    const vICMS   = fv(ictot,'vICMS');
    const vBC     = fv(ictot,'vBC');
    const vBCST   = fv(ictot,'vBCST');
    const vPIS    = fv(ictot,'vPIS');
    const vCOFINS = fv(ictot,'vCOFINS');
    const vNF     = fv(ictot,'vNF');
    const vImpostos = vICMS + vPIS + vCOFINS + vIPI;

    // Itens / produtos
    const dets = Array.from(inf.getElementsByTagNameNS(ns,'det'));
    const itens = dets.map(det => {
      const prod = det.getElementsByTagNameNS(ns,'prod')[0];
      const imp  = det.getElementsByTagNameNS(ns,'imposto')[0];
      const pv = (t) => parseFloat(gv(prod,t)||'0') || 0;
      // ICMS — pode ser ICMS00, ICMS10, ICMS20, ICMS60, ICMS70...
      const icmsBlock = imp?.getElementsByTagNameNS(ns,'ICMS')[0];
      let icmsTag='', vICMSItem=0, pICMS=0, vBCItem=0;
      if(icmsBlock) {
        const sub = icmsBlock.children[0] || icmsBlock.firstElementChild;
        if(sub) {
          icmsTag = sub.localName||sub.tagName;
          vICMSItem = parseFloat((sub.getElementsByTagNameNS(ns,'vICMS')[0]?.textContent||'0').trim())||0;
          pICMS     = parseFloat((sub.getElementsByTagNameNS(ns,'pICMS')[0]?.textContent||'0').trim())||0;
          vBCItem   = parseFloat((sub.getElementsByTagNameNS(ns,'vBC')[0]?.textContent||'0').trim())||0;
        }
      }
      const vPISItem    = parseFloat((imp?.getElementsByTagNameNS(ns,'vPIS')[0]?.textContent||'0').trim())||0;
      const vCOFINSItem = parseFloat((imp?.getElementsByTagNameNS(ns,'vCOFINS')[0]?.textContent||'0').trim())||0;
      return {
        nItem: det.getAttribute('nItem')||'',
        cProd: gv(prod,'cProd'), xProd: gv(prod,'xProd'), NCM: gv(prod,'NCM'),
        CFOP: gv(prod,'CFOP'), uCom: gv(prod,'uCom'),
        qCom: pv('qCom'), vUnCom: pv('vUnCom'), vProd: pv('vProd'),
        vDesc: pv('vDesc'), vFrete: pv('vFrete'), vOutro: pv('vOutro'),
        icmsTag, vBC: vBCItem, pICMS, vICMS: vICMSItem,
        vPIS: vPISItem, vCOFINS: vCOFINSItem
      };
    });

    return {
      ok: true, nomeArquivo, cnpjEmit, cnpjDivergente,
      nNF, serie, dhEmi, dtEmissao, natOp,
      infCplTxt, motivo, categoria,
      vProd, vDesc, vFrete, vSeg, vOutro, vIPI,
      vICMS, vBC, vBCST, vPIS, vCOFINS, vNF, vImpostos,
      itens
    };
  } catch(e) {
    return { ok: false, nomeArquivo, erro: e.message };
  }
}

// ---- Filtro ----
function avNotasFiltradas() {
  const { ini, fim, categoria, busca } = AvState.filtro;
  return AvState.notas.filter(n=>{
    if(!n.ok) return false;
    if(ini && n.dtEmissao && n.dtEmissao < ini) return false;
    if(fim && n.dtEmissao && n.dtEmissao > fim) return false;
    if(categoria && n.categoria !== categoria) return false;
    if(busca){
      const b = busca.toLowerCase();
      if(!( n.nNF.includes(b) || n.motivo.toLowerCase().includes(b) ||
            n.nomeArquivo.toLowerCase().includes(b) || n.natOp.toLowerCase().includes(b) )) return false;
    }
    return true;
  });
}

// Série mensal: [{label, anoMes, notas, itens, vNF, vProd, vImpostos}]
function avSerieMensal(notas) {
  const map = new Map();
  notas.forEach(n=>{
    if(!n.dtEmissao) return;
    const y = n.dtEmissao.getFullYear(), m = n.dtEmissao.getMonth();
    const key = `${y}-${String(m+1).padStart(2,'0')}`;
    const label = MESES_PT[m]+'/'+String(y).slice(2);
    const isTFC = avIsTFComprador(avNorm(n.motivo||''));
    const ex = map.get(key) || {key, label, ano:y, mes:m, notas:0, itens:0, vNF:0, vProd:0, vImpostos:0, vNFSemTFC:0, vTFC:0};
    ex.notas++; ex.itens+=n.itens.length; ex.vNF+=n.vNF; ex.vProd+=n.vProd; ex.vImpostos+=n.vImpostos;
    if(isTFC) ex.vTFC+=n.vNF; else ex.vNFSemTFC+=n.vNF;
    map.set(key, ex);
  });
  return [...map.values()].sort((a,b)=>a.key.localeCompare(b.key));
}

// Série anual
function avSerieAnual(notas) {
  const map = new Map();
  notas.forEach(n=>{
    if(!n.dtEmissao) return;
    const y = n.dtEmissao.getFullYear();
    const isTFC = avIsTFComprador(avNorm(n.motivo||''));
    const ex = map.get(y) || {ano:y, notas:0, itens:0, vNF:0, vProd:0, vImpostos:0, vNFSemTFC:0, vTFC:0};
    ex.notas++; ex.itens+=n.itens.length; ex.vNF+=n.vNF; ex.vProd+=n.vProd; ex.vImpostos+=n.vImpostos;
    if(isTFC) ex.vTFC+=n.vNF; else ex.vNFSemTFC+=n.vNF;
    map.set(y, ex);
  });
  return [...map.values()].sort((a,b)=>a.ano-b.ano);
}

// Comparativo: mês atual vs anterior (usando todas as notas, sem filtro de período)
function avComparativoMes() {
  const todasOk = AvState.notas.filter(n=>n.ok && n.dtEmissao);
  const { categoria } = AvState.filtro;
  const notas = categoria ? todasOk.filter(n=>n.categoria===categoria) : todasOk;
  const serie = avSerieMensal(notas);
  if(serie.length < 1) return null;
  const ult = serie[serie.length-1];
  const ant = serie.length>=2 ? serie[serie.length-2] : null;

  if(!ant) return { ult, ant: null, diffVNF: null, diffNotas: null };

  // Dia máximo presente no mês atual
  const notasMesAtual = notas.filter(n=>n.dtEmissao.getFullYear()===ult.ano && n.dtEmissao.getMonth()===ult.mes);
  const diaCorte = Math.max(...notasMesAtual.map(n=>n.dtEmissao.getDate()));

  // Helper: agrega notas em {vNF, vNFSemTFC, notas, itens}
  const agregar = (arr) => {
    const vNF       = arr.reduce((s,n)=>s+n.vNF,0);
    const vNFSemTFC = arr.filter(n=>!avIsTFComprador(avNorm(n.motivo||''))).reduce((s,n)=>s+n.vNF,0);
    const vTFC      = arr.filter(n=>avIsTFComprador(avNorm(n.motivo||''))).reduce((s,n)=>s+n.vNF,0);
    return { vNF, vNFSemTFC, vTFC, notas:arr.length, itens:arr.reduce((s,n)=>s+n.itens.length,0) };
  };

  const ultDados = agregar(notasMesAtual);

  // Notas do mês anterior (com ou sem corte de dia)
  const notasMesAntTodas = notas.filter(n=>n.dtEmissao.getFullYear()===ant.ano && n.dtEmissao.getMonth()===ant.mes);
  const notasMesAntCorte = window.avMesmaPeriodicidade
    ? notasMesAntTodas.filter(n=>n.dtEmissao.getDate()<=diaCorte)
    : notasMesAntTodas;

  const antDados = agregar(notasMesAntCorte);
  const antTotal = agregar(notasMesAntTodas);

  const diffVNF      = antDados.vNF      > 0 ? (ultDados.vNF      - antDados.vNF)      / antDados.vNF      * 100 : null;
  const diffVNFSemTF = antDados.vNFSemTFC> 0 ? (ultDados.vNFSemTFC- antDados.vNFSemTFC)/ antDados.vNFSemTFC* 100 : null;
  const diffNotas    = ultDados.notas - antDados.notas;

  return {
    ult: { ...ult, ...ultDados, label: ult.label },
    ant: { ...ant, ...antDados, label: ant.label },
    antTotal, diffVNF, diffVNFSemTF, diffNotas,
    diaCorte, mesmoPerido: window.avMesmaPeriodicidade
  };
}

// Semanas do mês mais recente
function avSemanasDoMes(notas) {
  const serie = avSerieMensal(notas);
  if(!serie.length) return [];
  const last = serie[serie.length-1];
  const mes = last.mes, ano = last.ano;
  const doMes = notas.filter(n=>n.dtEmissao && n.dtEmissao.getMonth()===mes && n.dtEmissao.getFullYear()===ano);
  const wmap = new Map();
  doMes.forEach(n=>{
    const d = n.dtEmissao;
    const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
    const wk = weekStart.toISOString().slice(0,10);
    const isTFC = avIsTFComprador(avNorm(n.motivo||''));
    const ex = wmap.get(wk) || {semana:wk, label:'Sem '+weekStart.getDate()+'/'+MESES_PT[weekStart.getMonth()], notas:0, itens:0, vNF:0, vNFSemTFC:0, vTFC:0};
    ex.notas++; ex.itens+=n.itens.length; ex.vNF+=n.vNF;
    if(isTFC) ex.vTFC+=n.vNF; else ex.vNFSemTFC+=n.vNF;
    wmap.set(wk, ex);
  });
  return [...wmap.values()].sort((a,b)=>a.semana.localeCompare(b.semana));
}

// Paleta exclusiva tons azuis/escuros sólidos — sem transparência nas barras
const AV_CORES = ['#0b2647','#1a4480','#2f6fce','#5b92e5','#8db4f0','#bcd4f8','#1b3a5e','#3d5f8a'];

const AV_TICK_Y_BRL = v => {
  if(v>=1000) return 'R$ '+Number(v/1000).toLocaleString('pt-BR',{minimumFractionDigits:0})+'k';
  return 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:0});
};
const AV_LABEL_BRL = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0}).replace(/\./g,'.');
const AV_LABEL_BRL2 = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

const AV_BASE_OPTS = (hasDataLabels=true, isBarHoriz=false) => ({
  responsive:true, maintainAspectRatio:false,
  layout:{ padding:{ top: hasDataLabels?32:10, right:10, bottom:4, left:4 } },
  plugins:{
    legend:{ display:true, position:'bottom', labels:{color:'#123a6b',font:{size:11},padding:16,usePointStyle:true} },
    tooltip:{ mode:'index', intersect:false, callbacks:{
      label: ctx => ' '+ctx.dataset.label+': '+AV_LABEL_BRL2(ctx.parsed[isBarHoriz?'x':'y'])
    }},
    datalabels: hasDataLabels ? {
      anchor:'end', align:'end', offset:4, clamp:true,
      color:'#1a4480', font:{size:9.5, weight:'700'},
      formatter: v => v>0 ? AV_LABEL_BRL(v) : ''
    } : { display:false }
  },
  scales:{
    x:{ ticks:{color:'#7a8798',font:{size:10}}, grid:{color:'#eef1f4'} },
    y:{ ticks:{color:'#7a8798',font:{size:10}, callback: AV_TICK_Y_BRL}, grid:{color:'#eef1f4'}, beginAtZero:true }
  }
});

function avRenderChart(id, type, labels, datasets, extraOpts={}) {
  const canvas = document.getElementById(id);
  if(!canvas) return;
  if(canvas._chartInstance){ canvas._chartInstance.destroy(); canvas._chartInstance=null; }
  const ctx = canvas.getContext('2d');
  const opts = JSON.parse(JSON.stringify(AV_BASE_OPTS(true)));
  // merge profundo de scales se extraOpts tiver
  if(extraOpts.scales){ Object.assign(opts.scales, extraOpts.scales); }
  if(extraOpts.plugins){ Object.assign(opts.plugins, extraOpts.plugins); }
  if(extraOpts.layout){ Object.assign(opts.layout, extraOpts.layout); }
  canvas._chartInstance = new Chart(ctx, { type, data:{labels,datasets}, options:opts });
}

if(!window.avMesmaPeriodicidade) window.avMesmaPeriodicidade = true;
function avTogglePeriodo(val){ window.avMesmaPeriodicidade = val; avRenderGraficos(); }

// Calcula % diferença entre dois valores
function avDiffPct(atual, anterior){
  if(!anterior || anterior===0) return null;
  return ((atual - anterior)/anterior)*100;
}

function avTabelaMensal(serie){
  if(!serie.length) return '';
  const fBRL = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const diffTag = (v) => {
    if(v===null) return '<span style="color:#7a8798;">—</span>';
    const cor = v>=0?'#d64545':'#1a9c62';
    const seta = v>=0?'▲':'▼';
    return `<span style="color:${cor};font-weight:700;">${seta} ${Math.abs(v).toFixed(1)}%</span>`;
  };
  const rows = serie.map((s,i)=>{
    const ant = i>0?serie[i-1]:null;
    const dvnf = ant?avDiffPct(s.vNF,ant.vNF):null;
    const dnotas = ant?avDiffPct(s.notas,ant.notas):null;
    return `<tr>
      <td><strong>${s.label}</strong></td>
      <td style="text-align:right;font-weight:700;">${fBRL(s.vNF)}</td>
      <td style="text-align:center;">${diffTag(dvnf)}</td>
      <td style="text-align:right;">${fBRL(s.vProd)}</td>
      <td style="text-align:right;">${fBRL(s.vImpostos)}</td>
      <td style="text-align:center;">${s.notas}</td>
      <td style="text-align:center;">${diffTag(dnotas)}</td>
      <td style="text-align:right;">${s.itens.toLocaleString('pt-BR')}</td>
      <td style="text-align:right;">${fBRL(s.notas?s.vNF/s.notas:0)}</td>
    </tr>`;
  }).join('');
  return `<div class="table-wrap" style="margin-top:14px;">
    <table class="data-table" style="font-size:11.5px;">
      <thead><tr>
        <th>Mês</th><th>Valor Total</th><th>Δ Val.%</th>
        <th>Valor Prod.</th><th>Impostos</th>
        <th>Notas</th><th>Δ Notas%</th><th>Itens</th><th>Média/Nota</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function avTabelaAnual(anos){
  if(!anos.length) return '';
  const fBRL = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const diffTag = (v) => {
    if(v===null) return '<span style="color:#7a8798;">—</span>';
    const cor = v>=0?'#d64545':'#1a9c62';
    const seta = v>=0?'▲':'▼';
    return `<span style="color:${cor};font-weight:700;">${seta} ${Math.abs(v).toFixed(1)}%</span>`;
  };
  const rows = anos.map((a,i)=>{
    const ant = i>0?anos[i-1]:null;
    const dv = ant?avDiffPct(a.vNF,ant.vNF):null;
    return `<tr>
      <td><strong>${a.ano}</strong></td>
      <td style="text-align:right;font-weight:700;">${fBRL(a.vNF)}</td>
      <td style="text-align:center;">${diffTag(dv)}</td>
      <td style="text-align:right;color:#0b2647;font-weight:700;">${fBRL(a.vNFSemTFC||0)}</td>
      <td style="text-align:right;color:#6b5200;font-weight:700;">${fBRL(a.vTFC||0)}</td>
      <td style="text-align:center;">${a.notas}</td>
      <td style="text-align:right;">${fBRL(a.notas?a.vNF/a.notas:0)}</td>
    </tr>`;
  }).join('');
  return `<div class="table-wrap" style="margin-top:14px;">
    <table class="data-table" style="font-size:11.5px;">
      <thead><tr>
        <th>Ano</th><th>Valor Total</th><th>Δ%</th>
        <th>Avaria (sem TFC)</th><th>TF Comprador</th>
        <th>Notas</th><th>Média/Nota</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function avTabelaSemanas(semanas){
  if(!semanas.length) return '';
  const fBRL = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const diffTag = (v) => {
    if(v===null) return '<span style="color:#7a8798;">—</span>';
    const cor = v>=0?'#d64545':'#1a9c62';
    const seta = v>=0?'▲':'▼';
    return `<span style="color:${cor};font-weight:700;">${seta} ${Math.abs(v).toFixed(1)}%</span>`;
  };
  const rows = semanas.map((s,i)=>{
    const ant = i>0?semanas[i-1]:null;
    const dv = ant?avDiffPct(s.vNF,ant.vNF):null;
    return `<tr>
      <td><strong>${s.label}</strong></td>
      <td style="text-align:right;font-weight:700;">${fBRL(s.vNF)}</td>
      <td style="text-align:center;">${diffTag(dv)}</td>
      <td style="text-align:center;">${s.notas}</td>
    </tr>`;
  }).join('');
  return `<div class="table-wrap" style="margin-top:14px;">
    <table class="data-table" style="font-size:11.5px;">
      <thead><tr><th>Semana</th><th>Valor Total</th><th>Δ%</th><th>Notas</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function avRenderGraficos() {
  const notas = avNotasFiltradas();
  const serie = avSerieMensal(notas);
  const anos  = avSerieAnual(notas);
  const semanas = avSemanasDoMes(notas);
  const comp = avComparativoMes();
  const fBRL2 = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

  // Configuração de rótulos para barras (todos os datasets)
  const DATALABELS_ALL = {
    anchor:'end', align:'end', offset:4, clamp:true,
    color: ctx => ctx.datasetIndex===0?'#0b2647':'#2f6fce',
    font:{size:9.5, weight:'700'},
    formatter: v => v>0 ? AV_LABEL_BRL(v) : ''
  };

  // ---- GRÁFICO 1: Valor mensal — 3 linhas (Total, Sem TFC, Só TFC) ----
  if(serie.length){
    const labels = serie.map(s=>s.label);
    avRenderChart('av-chart-mensal','line', labels, [
      { label:'Valor Total', data:serie.map(s=>s.vNF),
        hidden: true,
        borderColor:'#0b2647', backgroundColor:'#0b264710', borderWidth:2.5, tension:0.35,
        fill:true, pointRadius:5, pointBackgroundColor:'#0b2647', pointBorderColor:'#fff', pointBorderWidth:2 },
      { label:'Avaria (sem TFC)', data:serie.map(s=>s.vNFSemTFC),
        borderColor:'#0b2647', backgroundColor:'#0b264708', borderWidth:2, tension:0.35,
        fill:false, pointRadius:4, pointBackgroundColor:'#0b2647', borderDash:[4,2] },
      { label:'TF Comprador', data:serie.map(s=>s.vTFC),
        borderColor:'#e8cc60', borderWidth:2.5, tension:0.35,
        fill:false, pointRadius:4, pointBackgroundColor:'#e8cc60', pointBorderColor:'#6b5200', pointBorderWidth:1.5 }
    ], { plugins:{ datalabels:{ anchor:'end',align:'top',offset:5,clamp:true,
      color: ctx=>ctx.datasetIndex===2?'#6b5200':'#0b2647',
      font:{size:9.5,weight:'700'},formatter:v=>v>0?AV_LABEL_BRL(v):'' } } });
    const tel = document.getElementById('av-table-mensal');
    if(tel) tel.innerHTML = avTabelaMensal(serie);
  }

  // ---- GRÁFICO 2: Notas/Itens por mês + valor Avaria ano a ano em barras ----
  if(serie.length){
    // usa todas as notas agrupadas por ano (para barras de avaria anual)
    const todasOk = AvState.notas.filter(n=>n.ok&&n.dtEmissao);
    const catFiltro = AvState.filtro.categoria;
    const notasAnual = catFiltro ? todasOk.filter(n=>n.categoria===catFiltro) : todasOk;
    const anosData = avSerieAnual(notasAnual);
    // usa labels dos meses para eixo X das notas/itens
    avRenderChart('av-chart-notas','bar', serie.map(s=>s.label), [
      { label:'Notas', data:serie.map(s=>s.notas), backgroundColor:'#1a4480', borderRadius:5, borderSkipped:false },
      { label:'Itens', data:serie.map(s=>s.itens), backgroundColor:'#5b92e5', borderRadius:5, borderSkipped:false }
    ], { plugins:{ datalabels:{ anchor:'end',align:'end',offset:4,clamp:true,
      color: ctx=>ctx.datasetIndex===0?'#0b2647':'#1a4480', font:{size:10,weight:'700'},
      formatter: v=>v>0?v:'' } }, scales:{ y:{ ticks:{color:'#7a8798',font:{size:10}},grid:{color:'#eef1f4'},beginAtZero:true } } });
  }

  // ---- GRÁFICO 3: Ano a ano — SEMPRE total por ano, fixo ----
  if(anos.length){
    const todasOk = AvState.notas.filter(n=>n.ok&&n.dtEmissao);
    const catFiltro = AvState.filtro.categoria;
    const notasParaAnual = catFiltro ? todasOk.filter(n=>n.categoria===catFiltro) : todasOk;
    const anosTotal = avSerieAnual(notasParaAnual);
    avRenderChart('av-chart-anual','bar', anosTotal.map(a=>String(a.ano)), [
      { label:'Avaria (sem TF Comprador)', data:anosTotal.map(a=>a.vNFSemTFC),
        backgroundColor:'#0b2647', borderRadius:5, borderSkipped:false },
      { label:'TF Comprador', data:anosTotal.map(a=>a.vTFC),
        backgroundColor:'#e8cc60', borderRadius:5, borderSkipped:false }
    ], { plugins:{ datalabels:{ anchor:'end',align:'end',offset:4,clamp:true,
      color: ctx=>ctx.datasetIndex===0?'#0b2647':'#6b5200',
      font:{size:10,weight:'700'}, formatter:v=>v>0?AV_LABEL_BRL(v):'' } } });
    const tel2 = document.getElementById('av-table-anual');
    if(tel2) tel2.innerHTML = avTabelaAnual(anosTotal);
  }

  // ---- GRÁFICO 4: Semanas — 2 barras (Sem TFC + Só TFC) + rótulos em todos ----
  if(semanas.length){
    avRenderChart('av-chart-semanas','bar', semanas.map(s=>s.label), [
      { label:'Sem TF Comprador', data:semanas.map(s=>s.vNFSemTFC),
        backgroundColor:'#0b2647', borderRadius:5, borderSkipped:false },
      { label:'TF Comprador', data:semanas.map(s=>s.vTFC),
        backgroundColor:'#e8cc60', borderRadius:5, borderSkipped:false }
    ], {
      scales:{
        y:{ ticks:{color:'#7a8798',font:{size:10},callback:AV_TICK_Y_BRL}, grid:{color:'#eef1f4'}, beginAtZero:true }
      },
      plugins:{ datalabels:{ anchor:'end',align:'end',offset:4,clamp:true,
        color: ctx=>ctx.datasetIndex===0?'#0b2647':'#6b5200',
        font:{size:10,weight:'700'},
        formatter: v=>v>0?AV_LABEL_BRL(v):''
      }}
    });
    const tel3 = document.getElementById('av-table-semanas');
    if(tel3) tel3.innerHTML = avTabelaSemanas(semanas);
  }

  // ---- Cards de comparativo ----
  if(comp){
    const setEl = (id,v)=>{ const el=document.getElementById(id); if(el) el.innerHTML=v; };
    const mesmoP = window.avMesmaPeriodicidade;
    const periodoLabel = mesmoP && comp.diaCorte ? `dias 1–${comp.diaCorte} de cada mês` : 'mês atual vs fechado anterior';
    const corteLabel = mesmoP && comp.diaCorte ? ` (1–${comp.diaCorte})` : '';

    // Helper: gera bloco de indicadores (Variação Valor, Notas, Média) para um par de valores
    const blocoIndicadores = (vAtual, vAnt, notasAtual, notasAnt, itenAtual, itenAnt) => {
      if(vAnt <= 0) return '<span style="color:#7a8798;">Sem mês anterior para comparar.</span>';
      const diffV = (vAtual - vAnt) / vAnt * 100;
      const diffN = notasAtual - notasAnt;
      const corV  = diffV>=0?'#d64545':'#1a9c62';
      const setaV = diffV>=0?'▲':'▼';
      const corN  = diffN>=0?'#d64545':'#1a9c62';
      return `<div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div>
          <div style="font-size:9px;color:#7a8798;font-weight:700;text-transform:uppercase;margin-bottom:1px;">Variação Valor</div>
          <div style="font-size:18px;font-weight:800;color:${corV};">${setaV} ${Math.abs(diffV).toFixed(1)}%</div>
          <div style="font-size:10px;color:#7a8798;">${fBRL2(vAtual)} vs ${fBRL2(vAnt)}</div>
        </div>
        <div>
          <div style="font-size:9px;color:#7a8798;font-weight:700;text-transform:uppercase;margin-bottom:1px;">Variação Notas</div>
          <div style="font-size:18px;font-weight:800;color:${corN};">${diffN>=0?'+':''}${diffN}</div>
          <div style="font-size:10px;color:#7a8798;">${notasAtual} vs ${notasAnt} notas</div>
        </div>
        <div>
          <div style="font-size:9px;color:#7a8798;font-weight:700;text-transform:uppercase;margin-bottom:1px;">Média/Nota</div>
          <div style="font-size:16px;font-weight:800;color:#123a6b;">${fBRL2(notasAtual?vAtual/notasAtual:0)}</div>
          <div style="font-size:10px;color:#7a8798;">vs ${fBRL2(notasAnt?vAnt/notasAnt:0)}</div>
        </div>
        <div style="font-size:9px;color:#7a8798;padding-left:10px;border-left:2px solid #dde3ea;">
          Comparando:<br><strong>${periodoLabel}</strong>
        </div>
      </div>`;
    };

    // ---- BLOCO 1: Total Geral ----
    setEl('av-comp-ult-label', comp.ult.label + corteLabel);
    setEl('av-comp-ult-vnf',   fBRL2(comp.ult.vNF));
    setEl('av-comp-ult-notas', comp.ult.notas+' notas · '+comp.ult.itens+' itens'
      + (mesmoP && comp.antTotal ? `<br><span style="font-size:9px;color:#9db8dd;">Mês fechado: ${fBRL2(comp.antTotal.vNF)}</span>` : ''));
    setEl('av-comp-ant-label', comp.ant ? comp.ant.label + corteLabel : 'Sem mês anterior');
    setEl('av-comp-ant-vnf',   comp.ant ? fBRL2(comp.ant.vNF) : '—');
    setEl('av-comp-ant-notas', comp.ant ? comp.ant.notas+' notas · '+comp.ant.itens+' itens' : '—');
    setEl('av-comp-diff', comp.ant
      ? blocoIndicadores(comp.ult.vNF, comp.ant.vNF, comp.ult.notas, comp.ant.notas, comp.ult.itens, comp.ant.itens)
      : '<span style="color:#7a8798;">Sem mês anterior para comparar.</span>');

    // ---- BLOCO 2: Sem TF Comprador ----
    setEl('av-comp2-ult-label', comp.ult.label + corteLabel);
    setEl('av-comp2-ult-vnf',   fBRL2(comp.ult.vNFSemTFC));
    setEl('av-comp2-ult-notas', 'TFC: '+fBRL2(comp.ult.vTFC));
    setEl('av-comp2-ant-label', comp.ant ? comp.ant.label + corteLabel : 'Sem mês anterior');
    setEl('av-comp2-ant-vnf',   comp.ant ? fBRL2(comp.ant.vNFSemTFC) : '—');
    setEl('av-comp2-ant-notas', comp.ant ? 'TFC: '+fBRL2(comp.ant.vTFC) : '—');
    setEl('av-comp2-diff', comp.ant
      ? blocoIndicadores(comp.ult.vNFSemTFC, comp.ant.vNFSemTFC, comp.ult.notas, comp.ant.notas, comp.ult.itens, comp.ant.itens)
      : '<span style="color:#6b5200;">Sem mês anterior para comparar.</span>');
  }
}

function avCategorias(notas) {
  const map = new Map();
  notas.forEach(n=>{
    const c = n.categoria;
    const ex = map.get(c) || {categoria:c, notas:0, itens:0, vProd:0, vNF:0, vImpostos:0};
    ex.notas++;
    ex.itens  += n.itens.length;
    ex.vProd  += n.vProd;
    ex.vNF    += n.vNF;
    ex.vImpostos += n.vImpostos;
    map.set(c, ex);
  });
  return [...map.values()].sort((a,b)=>b.vNF-a.vNF);
}

// ---- Render principal ----
// abre a Administração mesmo sem os dados do painel (útil quando a leitura do Sheets falha)
function abrirAdminSemDados(){
  $("#empty-state").style.display = "none";
  $("#main-content").style.display = "block";
  UI.goTo("admin");
}

function abrirAvariaSemArquivo(){
  // Esconde o empty-state e mostra o main-content sem exigir arquivo
  $("#empty-state").style.display = "none";
  $("#main-content").style.display = "block";

  // Oculta as abas que dependem do arquivo (deixa só o subnav de indicadores com avaria visível)
  // Mostra a nav mas bloqueia Gestão até arquivo ser carregado
  const gestaoBtn = $(".nav-btn[data-view='gestao']");
  if(gestaoBtn && !window.APP_STATE.ready){
    gestaoBtn.title = "Carregue o Núcleo Reposição para acessar Gestão";
    gestaoBtn.style.opacity = "0.4";
    gestaoBtn.style.pointerEvents = "none";
  }

  // Vai direto para Indicadores > Avaria XML
  UI.switchView('indicadores', true);
  UI.switchPane('avaria');

  // Adiciona aviso no topo da aba de avaria orientando sobre o arquivo
  const hint = document.createElement('div');
  hint.id = 'avaria-sem-arquivo-hint';
  hint.className = 'hint-box';
  hint.innerHTML = '💡 Você está no modo <strong>Avaria XML</strong> sem o arquivo Núcleo Reposição. Carregue o arquivo <a href="#" onclick="document.getElementById(\'file-input\').click();return false;" style="color:#2f6fce;font-weight:700;">aqui</a> para acessar os outros módulos.';
  hint.style.marginBottom = '0';
  const pane = $("#pane-avaria");
  if(pane && !document.getElementById('avaria-sem-arquivo-hint')){
    pane.insertBefore(hint, pane.firstChild);
  }
}


// ===== CD 3D: módulo em iframe (cd3d.html), independe do Núcleo Reposição =====
function abrirCD3DSemArquivo(){
  $("#empty-state").style.display = "none";
  $("#main-content").style.display = "block";
  const gestaoBtn = $(".nav-btn[data-view='gestao']");
  if(gestaoBtn && !window.APP_STATE.ready){
    gestaoBtn.title = "Carregue o Núcleo Reposição para acessar Gestão";
    gestaoBtn.style.opacity = "0.4";
    gestaoBtn.style.pointerEvents = "none";
  }
  UI.switchView('indicadores', true);
  UI.switchPane('cd3d');
}

function cd3dEnviarEmbalagem(){
  const fr = document.getElementById('cd3d-frame');
  const proc = window.APP_STATE && window.APP_STATE.processed;
  if(!fr || !fr.contentWindow || !proc || !proc.p8022Nova) return;
  const pairs = proc.p8022Nova.filter(r => r.qtunitcx > 0).map(r => [r.codprod, r.qtunitcx]);
  if(pairs.length) fr.contentWindow.postMessage({ type:'cd3d-emb', pairs }, '*');
}

window.addEventListener('message', ev => {
  if(ev.data && ev.data.type === 'cd3d-ready') cd3dEnviarEmbalagem();
});

function renderCD3D(){
  const pane = document.getElementById('pane-cd3d');
  if(!pane) return;
  if(!document.getElementById('cd3d-frame')){
    pane.innerHTML = '<iframe id="cd3d-frame" src="cd3d.html" title="NVL 3D" ' +
      'style="width:100%;height:calc(100vh - 150px);min-height:560px;border:1px solid #dde3ea;border-radius:10px;background:#0f1218;display:block;"></iframe>';
  } else {
    cd3dEnviarEmbalagem(); // Núcleo carregado depois: reenvia a embalagem
  }
}

function renderAvaria() {
  const pane = document.getElementById('pane-avaria');
  if(!pane) return;
  const notas = avNotasFiltradas();
  const cats = avCategorias(notas);
  const totalNotas = notas.length;
  const totalItens = notas.reduce((s,n)=>s+n.itens.length,0);
  const totalVNF   = notas.reduce((s,n)=>s+n.vNF,0);
  const totalVProd = notas.reduce((s,n)=>s+n.vProd,0);
  const totalVimp  = notas.reduce((s,n)=>s+n.vImpostos,0);
  // TF Comprador sempre calculado a partir de TODAS as notas do período
  // independente do toggle — o valor deles é sempre fixo
  const notasTFCompPeriodo = notas.filter(n=> avIsTFComprador(avNorm(n.motivo||'')));
  const vTFComprador = notasTFCompPeriodo.reduce((s,n)=>s+n.vNF,0);
  // Valor Total SEM comprador (notas que não são TF Comprador)
  const vSemComprador = notas.filter(n=> !avIsTFComprador(avNorm(n.motivo||''))).reduce((s,n)=>s+n.vNF,0);
  // Avaria no período (conforme toggle)
  const vAvaria = notas.filter(n=>n.categoria==='Avaria').reduce((s,n)=>s+n.vNF,0);
  // Avaria + TF Comprador sempre somados
  const vAvariaComComp = window.avTFCompradorEmAvaria
    ? vAvaria                      // toggle=sim: já estão juntos
    : vAvaria + vTFComprador;      // toggle=não: soma manualmente

  const datas = notas.filter(n=>n.dtEmissao).map(n=>n.dtEmissao).sort((a,b)=>a-b);
  const dtMin = datas[0], dtMax = datas[datas.length-1];
  const alertasCNPJ = AvState.notas.filter(n=>n.ok&&n.cnpjDivergente);
  const erros = AvState.notas.filter(n=>!n.ok);

  // Título dinâmico — categoria selecionada ou nome padrão
  const tituloAba = AvState.filtro.categoria
    ? `${escapeHtml(AvState.filtro.categoria)} — Análise de NF-e`
    : 'Avaria XML — Análise de NF-e';

  const fBRL = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const mc = (icon, label, value, sub='', cor='#123a6b', bg='#fff', border='#dde3ea') =>
    `<div class="card" style="flex:1;min-width:130px;background:${bg};border-color:${border};">
      <div class="card-label">${icon} ${label}</div>
      <div class="card-value" style="color:${cor};">${value}</div>
      ${sub?`<div class="card-sub">${sub}</div>`:''}
    </div>`;

  pane.innerHTML = `
    <!-- UPLOAD -->
    <div class="panel">
      <div class="panel-header">
        <h3>${tituloAba}</h3>
        <div class="panel-actions">
          <label class="btn btn-primary" style="cursor:pointer;">
            📂 Carregar ZIP de XMLs
            <input type="file" id="av-zip-input" accept=".zip" style="display:none;">
          </label>
          ${AvState.notas.length?`<button class="btn btn-outline btn-sm" id="av-limpar">Limpar dados</button>`:''}
        </div>
      </div>
      ${AvState.notas.length===0?`<div class="hint-box">Carregue um arquivo <strong>.ZIP</strong> contendo os XMLs de NF-e para iniciar a análise.</div>`:`
        <div class="hint-box" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="font-size:12px;"><strong>Baixa TF Comprador</strong> (ex: "BAIXA TF ANDRE", "AVARIA TF WESLEY") somar à <strong>Avaria</strong>?</span>
          <div class="toggle-group" id="av-toggle-tf">
            <button data-v="sim" class="${window.avTFCompradorEmAvaria?'active':''}" onclick="avSetTFComprador(true)">Sim — somar à Avaria</button>
            <button data-v="nao" class="${!window.avTFCompradorEmAvaria?'active':''}">Não — separar</button>
          </div>
        </div>`}
      ${erros.length?`<div class="warn-box">⚠️ ${erros.length} arquivo(s) com erro de leitura: ${erros.map(e=>`<strong>${e.nomeArquivo}</strong>: ${e.erro}`).join(' · ')}</div>`:''}
      ${alertasCNPJ.length?`<div class="warn-box" style="background:#fef2f2;border-color:#d64545;">🚫 ${alertasCNPJ.length} XML(s) com CNPJ divergente:<br>${alertasCNPJ.map(n=>`<strong>${n.nomeArquivo}</strong>: encontrado <code>${n.cnpjEmit}</code> (esperado <code>${AvState.CNPJ_ESPERADO}</code>)`).join('<br>')}</div>`:''}
    </div>

    ${AvState.notas.length===0?'':`
    <!-- FILTROS -->
    <div class="panel">
      <div class="panel-header" style="margin-bottom:8px;">
        <h3>Filtros</h3>
        <div class="panel-actions" style="flex-wrap:wrap;gap:6px;">
          ${(()=>{
            // calcula atalhos baseado nas datas disponíveis nos XMLs
            const datas = AvState.notas.filter(n=>n.ok&&n.dtEmissao).map(n=>n.dtEmissao).sort((a,b)=>a-b);
            const dtMax = datas[datas.length-1] || new Date();
            const dtMin = datas[0];
            const ano = dtMax.getFullYear();
            const mes = dtMax.getMonth();
            // Mês atual
            const iniMesAtual = new Date(ano,mes,1).toISOString().slice(0,10);
            const fimMesAtual = new Date(ano,mes+1,0).toISOString().slice(0,10);
            // Mês anterior
            const iniMesAnt = new Date(ano,mes-1,1).toISOString().slice(0,10);
            const fimMesAnt = new Date(ano,mes,0).toISOString().slice(0,10);
            // Ano atual
            const iniAnoAtual = new Date(ano,0,1).toISOString().slice(0,10);
            const fimAnoAtual = new Date(ano,11,31).toISOString().slice(0,10);
            // Ano anterior
            const iniAnoAnt = new Date(ano-1,0,1).toISOString().slice(0,10);
            const fimAnoAnt = new Date(ano-1,11,31).toISOString().slice(0,10);
            // Tudo
            const iniTudo = dtMin ? dtMin.toISOString().slice(0,10) : '';
            const fimTudo = dtMax.toISOString().slice(0,10);
            const atalhos = [
              { label:'Mês Atual',  ini:iniMesAtual, fim:fimMesAtual },
              { label:'Mês Ant.',   ini:iniMesAnt,   fim:fimMesAnt },
              { label:'Ano Atual',  ini:iniAnoAtual, fim:fimAnoAtual },
              { label:'Ano Ant.',   ini:iniAnoAnt,   fim:fimAnoAnt },
              { label:'Tudo',       ini:'',           fim:'' },
            ];
            const iniAtual = AvState.filtro.ini ? AvState.filtro.ini.toISOString().slice(0,10) : '';
            const fimAtual = AvState.filtro.fim ? AvState.filtro.fim.toISOString().slice(0,10) : '';
            return atalhos.map(a=>{
              const ativo = (a.ini===iniAtual && a.fim===fimAtual) || (a.ini===''&&a.fim===''&&iniAtual===''&&fimAtual==='');
              return `<button class="btn ${ativo?'btn-primary':'btn-outline'} btn-sm" onclick="avAtalho('${a.ini}','${a.fim}')">${a.label}</button>`;
            }).join('');
          })()}
        </div>
      </div>
      <div class="toolbar" style="margin-bottom:0;">
        <div class="filter-group">
          <label>Data inicial</label>
          <input type="date" id="av-dt-ini" value="${AvState.filtro.ini?AvState.filtro.ini.toISOString().slice(0,10):''}">
        </div>
        <div class="filter-group">
          <label>Data final</label>
          <input type="date" id="av-dt-fim" value="${AvState.filtro.fim?AvState.filtro.fim.toISOString().slice(0,10):''}">
        </div>
        <div class="filter-group">
          <label>Categoria</label>
          <select id="av-cat-sel">
            <option value="">Todas</option>
            ${[...new Set(AvState.notas.filter(n=>n.ok).map(n=>n.categoria))].sort().map(c=>`<option value="${c}" ${AvState.filtro.categoria===c?'selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group" style="flex:2;">
          <label>Busca (NF, motivo, arquivo)</label>
          <input type="text" id="av-busca" placeholder="Pesquisar..." value="${AvState.filtro.busca}">
        </div>
        <button class="btn btn-outline btn-sm" id="av-limpar-filtro">Limpar</button>
      </div>
    </div>

    <!-- CARDS -->
    <div class="panel">
      <!-- linha 1: métricas gerais -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
        ${mc('📄','Total de Notas', totalNotas, dtMin&&dtMax?fmtDateBR(dtMin)+' a '+fmtDateBR(dtMax):'')}
        ${mc('📦','Total de Itens', totalItens.toLocaleString('pt-BR'))}
        ${mc('💰','Valor Total', fBRL(vSemComprador), `excl. TF Compradores`,'#1a9c62')}
        ${mc('💸','Total de Impostos', fBRL(totalVimp))}
        ${mc('⚠️','Categorias', cats.length, `${totalNotas} notas processadas`)}
      </div>
      <!-- linha 2: TF Compradores (sempre fixo) + combinado -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${mc('🔄','Valor TF Comprador', fBRL(vTFComprador), notasTFCompPeriodo.length+' nota(s) — valor fixo','#6b5200','#f5f2e4','#e8cc60')}
        ${mc('📊','Avaria + TF Comprador', fBRL(vAvariaComComp), 'soma combinada do período','#0b2647','#eff6ff','#1a4480')}
      </div>
    </div>

    <!-- COMPARATIVO MÊS vs MÊS ANTERIOR -->
    <div class="panel">
      <div class="panel-header">
        <h3>Comparativo — Mês Atual vs Anterior${AvState.filtro.categoria?' · '+AvState.filtro.categoria:''}</h3>
        <div class="panel-actions">
          <label style="font-size:11px;color:#7a8798;">Mesmo período:</label>
          <div class="toggle-group">
            <button class="${window.avMesmaPeriodicidade?'active':''}" onclick="avTogglePeriodo(true)">Sim</button>
            <button class="${!window.avMesmaPeriodicidade?'active':''}" onclick="avTogglePeriodo(false)">Não</button>
          </div>
        </div>
      </div>
      <!-- Duas colunas: Comparativo Geral | Comparativo Sem TF Comprador -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

        <!-- Bloco 1: Geral -->
        <div style="border:1px solid #dde3ea;border-radius:8px;padding:14px;">
          <div style="font-size:10px;font-weight:800;color:#1a4480;text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px;">📊 Total Geral</div>
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <div style="flex:1;background:#0b2647;border-radius:8px;padding:12px 14px;">
              <div style="font-size:9.5px;color:#9db8dd;font-weight:700;text-transform:uppercase;margin-bottom:3px;" id="av-comp-ult-label">—</div>
              <div style="font-size:22px;font-weight:800;color:#fff;" id="av-comp-ult-vnf">—</div>
              <div style="font-size:10px;color:#9db8dd;margin-top:2px;" id="av-comp-ult-notas">—</div>
            </div>
            <div style="flex:1;background:#f8fafc;border:1px solid #dde3ea;border-radius:8px;padding:12px 14px;">
              <div style="font-size:9.5px;color:#7a8798;font-weight:700;text-transform:uppercase;margin-bottom:3px;" id="av-comp-ant-label">—</div>
              <div style="font-size:22px;font-weight:800;color:#7a8798;" id="av-comp-ant-vnf">—</div>
              <div style="font-size:10px;color:#7a8798;margin-top:2px;" id="av-comp-ant-notas">—</div>
            </div>
          </div>
          <div id="av-comp-diff" style="font-size:12px;">Sem dados suficientes.</div>
        </div>

        <!-- Bloco 2: Sem TF Comprador -->
        <div style="border:1px solid #e8cc60;border-radius:8px;padding:14px;background:#f5f2e4;">
          <div style="font-size:10px;font-weight:800;color:#6b5200;text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px;">🔄 Sem TF Comprador</div>
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <div style="flex:1;background:#0b2647;border-radius:8px;padding:12px 14px;">
              <div style="font-size:9.5px;color:#9db8dd;font-weight:700;text-transform:uppercase;margin-bottom:3px;" id="av-comp2-ult-label">—</div>
              <div style="font-size:22px;font-weight:800;color:#fff;" id="av-comp2-ult-vnf">—</div>
              <div style="font-size:10px;color:#9db8dd;margin-top:2px;" id="av-comp2-ult-notas">—</div>
            </div>
            <div style="flex:1;background:#f5f2e4;border:1px solid #e8cc60;border-radius:8px;padding:12px 14px;">
              <div style="font-size:9.5px;color:#6b5200;font-weight:700;text-transform:uppercase;margin-bottom:3px;" id="av-comp2-ant-label">—</div>
              <div style="font-size:22px;font-weight:800;color:#6b5200;" id="av-comp2-ant-vnf">—</div>
              <div style="font-size:10px;color:#6b5200;margin-top:2px;" id="av-comp2-ant-notas">—</div>
            </div>
          </div>
          <div id="av-comp2-diff" style="font-size:12px;">Sem dados suficientes.</div>
        </div>

      </div>
    </div>

    <!-- GRÁFICOS -->
    <div class="panel av-page-break">
      <div class="panel-header"><h3>Valor Total por Mês${AvState.filtro.categoria?' — '+AvState.filtro.categoria:''}</h3></div>
      <div class="chart-wrap" style="height:280px;"><canvas id="av-chart-mensal"></canvas></div>
      <div id="av-table-mensal"></div>
    </div>

    <div class="grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="panel">
        <div class="panel-header"><h3>Notas e Itens por Mês</h3></div>
        <div class="chart-wrap" style="height:240px;"><canvas id="av-chart-notas"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h3>Valor por Ano (todos os dados)</h3>
        </div>
        <div class="chart-wrap" style="height:240px;"><canvas id="av-chart-anual"></canvas></div>
        <div id="av-table-anual"></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>Semanas do Último Mês com Dados</h3></div>
      <div class="chart-wrap" style="height:240px;"><canvas id="av-chart-semanas"></canvas></div>
      <div id="av-table-semanas"></div>
    </div>

    <!-- RANKING DE CATEGORIAS -->
    <div class="panel">
      <div class="panel-header"><h3>Ranking por Categoria</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Categoria</th><th>Notas</th><th>Itens</th><th>Valor Produtos</th><th>Valor Total</th><th>Média/Nota</th></tr></thead>
          <tbody>
            ${cats.map((c,i)=>`<tr class="clickable" onclick="avFiltrarCategoria('${escapeHtml(c.categoria)}')">
              <td style="color:#7a8798;">${i+1}</td>
              <td><strong>${escapeHtml(c.categoria)}</strong></td>
              <td>${c.notas}</td><td>${c.itens.toLocaleString('pt-BR')}</td>
              <td>${fBRL(c.vProd)}</td>
              <td><strong>${fBRL(c.vNF)}</strong></td>
              <td>${fBRL(c.notas?c.vNF/c.notas:0)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TABELA DE NOTAS -->
    <div class="panel">
      <div class="panel-header">
        <h3>Notas Fiscais — ${totalNotas} registros${AvState.filtro.categoria?' · '+AvState.filtro.categoria:''}</h3>
      </div>
      <div class="table-wrap">
        <table class="data-table" style="font-size:11.5px;">
          <thead><tr>
            <th>Data</th><th>NF</th><th>Série</th><th>Natureza</th>
            <th>Motivo Original</th><th>Categoria</th><th>Itens</th>
            <th>Valor Prod.</th><th>Impostos</th><th>Valor Total</th><th>Arquivo</th>
          </tr></thead>
          <tbody>
            ${[...notas].sort((a,b)=>b.vNF-a.vNF).slice(0,200).map(n=>`<tr class="clickable" onclick="avAbrirDetalhe('${escapeHtml(n.nNF+'-'+n.serie)}')">
              <td>${n.dtEmissao?fmtDateBR(n.dtEmissao):'—'}</td>
              <td style="font-weight:700;color:#2f6fce;">${escapeHtml(n.nNF)}</td>
              <td>${escapeHtml(n.serie)}</td>
              <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(n.natOp)}">${escapeHtml(n.natOp)}</td>
              <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(n.motivo)}">${escapeHtml(n.motivo)||'—'}</td>
              <td><span style="background:#2f6fce22;color:#2f6fce;font-size:9px;font-weight:800;padding:2px 7px;border-radius:10px;">${escapeHtml(n.categoria)}</span></td>
              <td>${n.itens.length}</td>
              <td>${fBRL(n.vProd)}</td>
              <td>${fBRL(n.vImpostos)}</td>
              <td><strong>${fBRL(n.vNF)}</strong></td>
              <td style="font-size:10px;color:#7a8798;max-width:100px;overflow:hidden;text-overflow:ellipsis;" title="${escapeHtml(n.nomeArquivo)}">${escapeHtml(n.nomeArquivo.replace(/-nfe-proc\.xml$/,''))}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        ${totalNotas>200?`<div class="hint-box">Exibindo 200 de ${totalNotas} notas. Use os filtros para refinar.</div>`:''}
      </div>
    </div>

    <!-- DETALHE DA NOTA (se aberto) -->
    <div id="av-detalhe"></div>
    `}
  `;

  document.getElementById('av-zip-input')?.addEventListener('change', avCarregarZip);
  document.getElementById('av-limpar')?.addEventListener('click', ()=>{ AvState.notas=[]; AvState.filtro={ini:null,fim:null,categoria:null,busca:''}; renderAvaria(); });
  document.getElementById('av-dt-ini')?.addEventListener('change', e=>{ AvState.filtro.ini=e.target.value?new Date(e.target.value+'T00:00:00'):null; renderAvaria(); });
  document.getElementById('av-dt-fim')?.addEventListener('change', e=>{ AvState.filtro.fim=e.target.value?new Date(e.target.value+'T23:59:59'):null; renderAvaria(); });
  document.getElementById('av-cat-sel')?.addEventListener('change', e=>{ AvState.filtro.categoria=e.target.value||null; renderAvaria(); });
  document.getElementById('av-busca')?.addEventListener('input', e=>{ AvState.filtro.busca=e.target.value; renderAvaria(); });
  document.getElementById('av-limpar-filtro')?.addEventListener('click', ()=>{ AvState.filtro={ini:null,fim:null,categoria:null,busca:''}; renderAvaria(); });
  const tfNao = document.querySelector('#av-toggle-tf [data-v="nao"]');
  if(tfNao) tfNao.addEventListener('click', ()=> avSetTFComprador(false));
  if(AvState.notas.length > 0) setTimeout(()=> avRenderGraficos(), 60);
  if(AvState.detalheNota) avRenderDetalhe(AvState.detalheNota);
}

function avAtalho(ini, fim) {
  AvState.filtro.ini = ini ? new Date(ini + 'T00:00:00') : null;
  AvState.filtro.fim = fim ? new Date(fim + 'T23:59:59') : null;
  renderAvaria();
}

// Muda o toggle TF Comprador → Avaria e recategoriza TODAS as notas na memória
function avSetTFComprador(val) {
  window.avTFCompradorEmAvaria = val;
  // Recategoriza todas as notas já carregadas (sem reler os XMLs)
  AvState.notas.forEach(n => {
    if(n.ok && n.motivo) {
      n.categoria = avNormalizarCategoria(n.motivo);
    }
  });
  // Se havia filtro de categoria que agora não existe mais, limpa
  const cats = new Set(AvState.notas.filter(n=>n.ok).map(n=>n.categoria));
  if(AvState.filtro.categoria && !cats.has(AvState.filtro.categoria)){
    AvState.filtro.categoria = null;
  }
  renderAvaria();
}

function avFiltrarCategoria(cat) {
  AvState.filtro.categoria = AvState.filtro.categoria===cat ? null : cat;
  AvState.detalheNota = null;
  renderAvaria();
}

function avAbrirDetalhe(key) {
  const [nNF, serie] = key.split('-');
  const nota = avNotasFiltradas().find(n=>n.nNF===nNF && n.serie===serie);
  if(!nota) return;
  AvState.detalheNota = nota;
  avRenderDetalhe(nota);
  setTimeout(()=>document.getElementById('av-detalhe')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
}

function avRenderDetalhe(nota) {
  const el = document.getElementById('av-detalhe');
  if(!el) return;
  const fBRL = v => 'R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const totalItens = nota.itens.reduce((s,i)=>s+i.qCom,0);
  el.innerHTML = `
    <div class="panel" style="border-left:4px solid #2f6fce;">
      <div class="panel-header">
        <h3>Detalhe NF-e ${escapeHtml(nota.nNF)} — Série ${escapeHtml(nota.serie)}</h3>
        <button class="btn btn-outline btn-sm" onclick="AvState.detalheNota=null;document.getElementById('av-detalhe').innerHTML='';">Fechar</button>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px;">
        <div style="flex:1;min-width:220px;">
          <table style="font-size:12px;border-collapse:collapse;width:100%;">
            ${[
              ['Data Emissão', nota.dtEmissao?fmtDateBR(nota.dtEmissao):'—'],
              ['CNPJ Emitente', nota.cnpjEmit+(nota.cnpjDivergente?' <span style="color:#d64545;font-weight:700;">⚠️ divergente</span>':'')],
              ['Natureza da Operação', escapeHtml(nota.natOp)],
              ['Motivo Original', `<strong>${escapeHtml(nota.motivo||'—')}</strong>`],
              ['Categoria Padronizada', `<span style="background:#2f6fce22;color:#2f6fce;font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;">${escapeHtml(nota.categoria)}</span>`],
              ['Arquivo XML', `<span style="font-size:10px;color:#7a8798;">${escapeHtml(nota.nomeArquivo)}</span>`],
            ].map(([k,v])=>`<tr><td style="padding:4px 8px 4px 0;color:#7a8798;white-space:nowrap;">${k}:</td><td style="padding:4px 0;">${v}</td></tr>`).join('')}
          </table>
        </div>
        <div style="flex:1;min-width:220px;">
          <table style="font-size:12px;border-collapse:collapse;width:100%;">
            ${[
              ['Valor dos Produtos', fBRL(nota.vProd)],
              ['Desconto', fBRL(nota.vDesc)],
              ['Frete', fBRL(nota.vFrete)],
              ['ICMS', fBRL(nota.vICMS)],
              ['PIS', fBRL(nota.vPIS)],
              ['COFINS', fBRL(nota.vCOFINS)],
              ['IPI', fBRL(nota.vIPI)],
              ['Total Impostos', fBRL(nota.vImpostos)],
              ['VALOR TOTAL NF', `<strong style="color:#1a9c62;font-size:14px;">${fBRL(nota.vNF)}</strong>`],
            ].map(([k,v])=>`<tr><td style="padding:4px 8px 4px 0;color:#7a8798;">${k}:</td><td style="padding:4px 0;">${v}</td></tr>`).join('')}
          </table>
        </div>
      </div>
      <div style="margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;color:#123a6b;margin-bottom:4px;">Informações Adicionais (infAdic completo):</div>
        <div style="font-size:11px;background:#f8fafc;border:1px solid #dde3ea;border-radius:4px;padding:8px;font-family:monospace;white-space:pre-wrap;color:#4a5568;">${escapeHtml(nota.infCplTxt||'—')}</div>
      </div>
      <div style="font-size:12px;font-weight:700;color:#123a6b;margin:14px 0 6px;">Produtos (${nota.itens.length} itens · ${fBRL(nota.vProd)} total)</div>
      <div class="table-wrap">
        <table class="data-table" style="font-size:11px;">
          <thead><tr>
            <th>#</th><th>Código</th><th>Descrição</th><th>NCM</th><th>CFOP</th>
            <th>Un.</th><th>Qtd.</th><th>Vl. Unit.</th><th>Vl. Prod.</th>
            <th>BC ICMS</th><th>%ICMS</th><th>Vl. ICMS</th><th>PIS</th><th>COFINS</th>
          </tr></thead>
          <tbody>
            ${nota.itens.map(it=>`<tr>
              <td>${escapeHtml(it.nItem)}</td>
              <td style="color:#2f6fce;">${escapeHtml(it.cProd)}</td>
              <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(it.xProd)}">${escapeHtml(it.xProd)}</td>
              <td>${escapeHtml(it.NCM)}</td><td>${escapeHtml(it.CFOP)}</td>
              <td>${escapeHtml(it.uCom)}</td>
              <td>${it.qCom.toLocaleString('pt-BR',{maximumFractionDigits:4})}</td>
              <td>${fBRL(it.vUnCom)}</td>
              <td><strong>${fBRL(it.vProd)}</strong></td>
              <td>${it.vBC?fBRL(it.vBC):'—'}</td>
              <td>${it.pICMS?it.pICMS+'%':'—'}</td>
              <td>${it.vICMS?fBRL(it.vICMS):'—'}</td>
              <td>${it.vPIS?fBRL(it.vPIS):'—'}</td>
              <td>${it.vCOFINS?fBRL(it.vCOFINS):'—'}</td>
            </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr style="background:#f0f4f8;font-weight:700;">
              <td colspan="6">TOTAL</td>
              <td>${totalItens.toLocaleString('pt-BR',{maximumFractionDigits:4})}</td>
              <td>—</td>
              <td>${fBRL(nota.vProd)}</td>
              <td>—</td><td>—</td>
              <td>${fBRL(nota.vICMS)}</td>
              <td>${fBRL(nota.vPIS)}</td>
              <td>${fBRL(nota.vCOFINS)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

async function avCarregarZip(e) {
  const file = e.target.files[0];
  if(!file) return;
  toast('Processando ZIP...');
  try {
    // carrega JSZip via CDN se não disponível
    if(typeof JSZip === 'undefined') {
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload=res; s.onerror=rej;
        document.head.appendChild(s);
      });
    }
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);
    const novas = [];
    const proms = [];
    zip.forEach((relPath, zipEntry) => {
      if(zipEntry.dir) return;
      const nome = relPath.split('/').pop();
      if(!nome.toLowerCase().endsWith('.xml')) return;
      proms.push(
        zipEntry.async('string').then(xmlStr => {
          novas.push(avParseXML(xmlStr, nome));
        })
      );
    });
    await Promise.all(proms);
    AvState.notas = novas;
    AvState.filtro = { ini:null, fim:null, categoria:null, busca:'' };
    AvState.detalheNota = null;
    const ok = novas.filter(n=>n.ok).length;
    const err = novas.filter(n=>!n.ok).length;
    toast(`${ok} XML(s) processados${err?' · '+err+' com erro':''}.`, 'success');
    renderAvaria();
  } catch(err) {
    console.error(err);
    toast('Erro ao processar ZIP: '+err.message, 'error');
  }
}

/* ---------------------------------------------------------------------- */
/* MODULE: Produção Operadores 8457 (Indicadores → Produção Operadores)   */
/* Mapa de calor: onde descem mais OS tipo 61 (rua × prédio/nível/apto)  */
/* ---------------------------------------------------------------------- */
const Op8457State = {
  ini: null,        // Date | null
  fim: null,        // Date | null
  mesmoP: true,     // mesmo período para comparativo
  filtroOp: '',     // codKey do operador filtrado
  viewMode: 'rua_predio',
};

function op8457MaxDate(){
  const rows = (window.APP_STATE.processed.p8457||[]).filter(r=>r.tipo61&&r.dtinicio);
  if(!rows.length) return Production.maxDataDate()||new Date();
  return new Date(Math.max(...rows.map(r=>r.dtinicio.getTime())));
}

function getRows8457(ini, fim, operador) {
  const rows = (window.APP_STATE.processed.p8457||[]).filter(r=>r.tipo61&&r.dtinicio);
  const i2 = ini || new Date(0);
  const f2 = fim || new Date(9999,0,1);
  let r2 = rows.filter(r=>{ const d=dateOnly(r.dtinicio); return d>=i2&&d<=f2; });
  if(operador) r2 = r2.filter(r=>r.codKey===operador);
  return r2;
}

// helpers para calcular períodos a partir das datas dos dados
function op8457Atalho(tipo){
  const {ini,fim}=periodoAtalho(tipo==='mes_anterior'?'mes_ant':tipo);
  Op8457State.ini=ini; Op8457State.fim=fim;
  renderOperadores();
}

function buildHeatmap(rows, dimX, dimY) {
  const map = new Map();
  const xs = new Set(), ys = new Set();
  rows.forEach(r => {
    const x = r[dimX]||'?', y = r[dimY]||'?';
    xs.add(x); ys.add(y);
    const k = x+'|||'+y;
    map.set(k,(map.get(k)||0)+1);
  });
  const natSort = (a,b)=>{ const na=parseFloat(a),nb=parseFloat(b); if(!isNaN(na)&&!isNaN(nb)) return na-nb; return String(a).localeCompare(String(b),'pt-BR',{numeric:true}); };
  const xArr = [...xs].sort(natSort);
  const yArr = [...ys].sort(natSort);
  const maxVal = Math.max(...map.values(),1);
  return { xArr, yArr, map, maxVal };
}

function heatColor(val, maxVal) {
  if(!val) return '#f0f4f8';
  const t = val/maxVal;
  const r=Math.round(11+(189-11)*(1-t)), g=Math.round(38+(220-38)*(1-t)), b=Math.round(71+(248-71)*(1-t));
  return `rgb(${r},${g},${b})`;
}

// Série mensal por operador ou geral
function op8457SerieMensal(rows){
  const map = new Map();
  rows.forEach(r=>{
    const y=r.dtinicio.getFullYear(), m=r.dtinicio.getMonth();
    const k=`${y}-${String(m+1).padStart(2,'0')}`;
    const label=MESES_PT[m]+'/'+String(y).slice(2);
    const ex=map.get(k)||{key:k,label,ano:y,mes:m,total:0};
    ex.total++;
    map.set(k,ex);
  });
  return [...map.values()].sort((a,b)=>a.key.localeCompare(b.key));
}

// Ranking de operadores em um conjunto de rows — conta linhas (itens) e QTD total
function op8457Ranking(rows){
  const registry = window.APP_STATE.nameRegistry;
  const map = new Map();
  rows.forEach(r=>{
    const k = r.codKey||'?';
    const n = registry.get(k)||r.nome||k;
    const ex = map.get(k)||{codKey:k,nome:n,total:0,qtdTotal:0,diasSet:new Set()};
    ex.total++;             // 1 item = 1 O.S. neste dataset
    ex.qtdTotal += r.qtd||0;
    if(r.dtinicio) ex.diasSet.add(ymdKey(r.dtinicio));
    map.set(k,ex);
  });
  return [...map.values()].map(op=>({
    ...op, dias:op.diasSet.size,
    media: op.diasSet.size ? op.total/op.diasSet.size : 0,
    mediaQtd: op.diasSet.size ? op.qtdTotal/op.diasSet.size : 0
  })).sort((a,b)=>b.total-a.total);
}

// Retorna o bloco de um prédio
function opBloco(predio){
  const p = parseInt(predio)||0;
  if(p<=0)  return null;
  if(p<=10) return '01–10';
  if(p<=20) return '11–20';
  if(p<=30) return '21–30';
  if(p<=40) return '31–40';
  if(p<=50) return '41–50';
  if(p<=60) return '51–60';
  return '61+';
}
const BLOCOS_ORD = ['01–10','11–20','21–30','31–40','41–50','51–60','61+'];

function renderOperadores() {
  const pane = $('#pane-operadores');
  const processed = window.APP_STATE.processed;

  if(!processed.p8457dispo||!processed.p8457.length){
    pane.innerHTML=`<div class="warn-box">A aba <strong>8457</strong> não foi encontrada.<br>
      Colunas esperadas: <strong>CODFUNCOS, NOME, TIPOOS, DATA, RUA_D, PREDIO_D, NIVEL_D, APTO_D, QTD</strong>.</div>`;
    return;
  }

  const maxD = op8457MaxDate();
  const y=maxD.getFullYear(), m=maxD.getMonth();
  const registry = window.APP_STATE.nameRegistry;

  const iniAtual = Op8457State.ini || new Date(y,m,1);
  const fimAtual = Op8457State.fim || dateOnly(maxD);
  const diasPeriodo = Math.round((fimAtual-iniAtual)/86400000)+1;
  const fimAnt = new Date(iniAtual.getTime()-86400000);
  const iniAnt = new Date(fimAnt.getTime()-(diasPeriodo-1)*86400000);
  const diaCorte = fimAtual.getDate();

  const rowsAtual = getRows8457(iniAtual, fimAtual, Op8457State.filtroOp);
  const rowsAnt   = getRows8457(iniAnt, fimAnt, Op8457State.filtroOp);
  const rowsAntP  = Op8457State.mesmoP ? rowsAnt.filter(r=>r.dtinicio.getDate()<=diaCorte) : rowsAnt;

  // Operadores para filtro
  const opMap = new Map();
  processed.p8457.filter(r=>r.tipo61&&r.codKey&&r.nome&&!r.nome.includes('APOIO WMS')).forEach(r=>{
    if(!opMap.has(r.codKey)) opMap.set(r.codKey,registry.get(r.codKey)||r.nome||r.codKey);
  });
  const opList = [...opMap.entries()].sort((a,b)=>a[1].localeCompare(b[1]));

  const totalAtual   = rowsAtual.length;
  const totalAnt     = rowsAntP.length;
  const totalQtdAtual= rowsAtual.reduce((s,r)=>s+(r.qtd||0),0);
  const diffAbs = totalAtual-totalAnt;
  const diffPct = totalAnt>0?((totalAtual-totalAnt)/totalAnt*100):null;
  const opAtivos = new Set(rowsAtual.filter(r=>r.codKey).map(r=>r.codKey)).size;
  const ruasAtivas = new Set(rowsAtual.filter(r=>r.rua).map(r=>r.rua)).size;

  const rankAtual  = op8457Ranking(rowsAtual);
  const rankAntMap = new Map(op8457Ranking(rowsAntP).map(r=>[r.codKey,r]));
  const serieAtual = op8457SerieMensal(rowsAtual);
  const serieAntP  = op8457SerieMensal(rowsAntP);

  // ---- Mapa rua × prédio ----
  const natSort=(a,b)=>{ const na=parseFloat(a),nb=parseFloat(b); return(!isNaN(na)&&!isNaN(nb))?na-nb:String(a).localeCompare(String(b),undefined,{numeric:true}); };

  const rpMap = new Map(); // 'rua|||predio' → count
  const ruaSet=new Set(), predSet=new Set();
  rowsAtual.forEach(r=>{
    if(!r.rua||!r.predio) return;
    const k=r.rua+'|||'+r.predio;
    rpMap.set(k,(rpMap.get(k)||0)+1);
    ruaSet.add(r.rua); predSet.add(r.predio);
  });
  const ruas   = [...ruaSet].sort(natSort);
  const predios= [...predSet].sort(natSort);
  const maxCell= Math.max(...rpMap.values(),1);

  // Média por rua (total / nº prédios distintos nessa rua)
  const ruaTotal   = new Map(); // rua → total OS
  const ruaPredSet = new Map(); // rua → Set de prédios
  rowsAtual.forEach(r=>{
    if(!r.rua||!r.predio) return;
    ruaTotal.set(r.rua,(ruaTotal.get(r.rua)||0)+1);
    if(!ruaPredSet.has(r.rua)) ruaPredSet.set(r.rua,new Set());
    ruaPredSet.get(r.rua).add(r.predio);
  });

  // Média por bloco (agrupa prédios em faixas)
  const blocoMap = new Map(); // bloco → {total, ruaSet}
  rowsAtual.forEach(r=>{
    if(!r.rua||!r.predio) return;
    const b = opBloco(r.predio);
    if(!b) return;
    const ex = blocoMap.get(b)||{total:0,ruaSet:new Set(),predSet:new Set()};
    ex.total++;
    ex.ruaSet.add(r.rua);
    ex.predSet.add(r.predio);
    blocoMap.set(b,ex);
  });

  // Blocos com dados, na ordem correta
  const blocosComDados = BLOCOS_ORD.filter(b=>blocoMap.has(b));

  const mc=(label,value,sub='',cor='#123a6b',bg='#fff',border='#dde3ea')=>
    `<div class="card" style="flex:1;min-width:120px;background:${bg};border-color:${border};">
      <div class="card-label">${label}</div>
      <div class="card-value" style="color:${cor};">${value}</div>
      ${sub?`<div class="card-sub">${sub}</div>`:''}
    </div>`;

  // atalhos ativos
  const iniStr=Op8457State.ini?Op8457State.ini.toISOString().slice(0,10):'';
  const fimStr=Op8457State.fim?Op8457State.fim.toISOString().slice(0,10):'';
  const mAtualIni=new Date(y,m,1).toISOString().slice(0,10);
  const mAtualFim=dateOnly(maxD).toISOString().slice(0,10);
  const mAntIni=new Date(y,m-1,1).toISOString().slice(0,10);
  const mAntFim=new Date(y,m,0).toISOString().slice(0,10);
  const ativo=(tipo)=>{
    if(tipo==='mes_atual')   return iniStr===mAtualIni&&fimStr===mAtualFim;
    if(tipo==='mes_anterior')return iniStr===mAntIni&&fimStr===mAntFim;
    return !iniStr&&!fimStr;
  };

  pane.innerHTML=`
    <!-- FILTROS -->
    <div class="panel">
      <div class="panel-header">
        <h3>Produção Operadores — O.S. Tipo 61 (8457)</h3>
        <div class="panel-actions" style="gap:6px;flex-wrap:wrap;">
          ${renderAtalhos(atalhoAtivoPorDatas(Op8457State.ini,Op8457State.fim,['mes_atual','mes_ant']),'op8457Atalho',['mes_atual','mes_ant','tudo'])}
        </div>
      </div>
      <div class="toolbar">
        <div class="filter-group"><label>Data Inicial</label>
          <input type="date" id="op-dt-ini" value="${iniStr}"></div>
        <div class="filter-group"><label>Data Final</label>
          <input type="date" id="op-dt-fim" value="${fimStr}"></div>
        <div class="filter-group" style="flex:2;"><label>Operador</label>
          <select id="op-oper-select">
            <option value="">Todos</option>
            ${opList.map(([k,n])=>`<option value="${escapeHtml(k)}" ${Op8457State.filtroOp===k?'selected':''}>${escapeHtml(n)}</option>`).join('')}
          </select></div>
        <div class="filter-group"><label>Mesma periodicidade</label>
          <div class="toggle-group">
            <button onclick="Op8457State.mesmoP=true;renderOperadores();" class="${Op8457State.mesmoP?'active':''}">Sim</button>
            <button onclick="Op8457State.mesmoP=false;renderOperadores();" class="${!Op8457State.mesmoP?'active':''}">Não</button>
          </div></div>
      </div>
    </div>

    <!-- CARDS RESUMO -->
    <div class="panel">
      <div class="panel-header"><h3>Resumo: ${fmtDateBR(iniAtual)} a ${fmtDateBR(fimAtual)}
        <span style="margin-left:8px;font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;
          background:${RelState.apenasRep?'#0b2647':'#5b92e5'};color:#fff;">
          ${RelState.apenasRep?'👥 Apenas Reposição':'🌐 Todos'}
        </span>
        <span style="margin-left:4px;font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;
          background:${RelState.apenasAvaria?'#1a4480':'#8db4f0'};color:#fff;">
          ${RelState.apenasAvaria?'✅ REP.AVARIA':'📋 Todos os Lançamentos'}
        </span>
      </h3></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="border:1px solid #dde3ea;border-radius:8px;padding:12px;">
          <div style="font-size:10px;font-weight:800;color:#0b2647;text-transform:uppercase;margin-bottom:8px;">📅 Período Atual</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${mc('📋 O.S.',fmtNum(totalAtual),'tipo 61','#0b2647')}
            ${mc('📦 Unidades',fmtNum(totalQtdAtual),'movimentadas')}
            ${mc('👷 Operadores',opAtivos,'')}
            ${mc('🏘️ Ruas Ativas',ruasAtivas,'')}
          </div>
        </div>
        <div style="border:1px solid #dde3ea;border-radius:8px;padding:12px;background:#f8fafc;">
          <div style="font-size:10px;font-weight:800;color:#7a8798;text-transform:uppercase;margin-bottom:8px;">
            📅 Período Anterior${Op8457State.mesmoP?` (1–${diaCorte})`:''}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${mc('📋 O.S.',fmtNum(totalAnt),'','#7a8798','#f8fafc')}
            ${mc('Δ Abs.',(diffAbs>=0?'+':'')+fmtNum(diffAbs),'',diffAbs>=0?'#1a9c62':'#d64545')}
            ${mc('Δ %',diffPct!==null?((diffPct>=0?'▲ ':'▼ ')+Math.abs(diffPct).toFixed(1)+'%'):'—','',diffPct===null?'#7a8798':diffPct>=0?'#1a9c62':'#d64545')}
          </div>
        </div>
      </div>
    </div>

    <!-- GRÁFICO COMPARATIVO -->
    <div class="panel">
      <div class="panel-header"><h3>Evolução de O.S. — Atual vs Anterior</h3></div>
      <div style="height:240px;"><canvas id="op-chart-comp"></canvas></div>
    </div>

    <!-- MÉDIAS POR RUA -->
    <div class="panel">
      <div class="panel-header"><h3>Média de O.S. por Rua</h3></div>
      <div class="table-wrap">
        <table class="data-table" style="font-size:11.5px;">
          <thead><tr><th>Rua</th><th>Total O.S.</th><th>Prédios Atendidos</th><th>Média O.S./Prédio</th><th>% do Total</th></tr></thead>
          <tbody>
            ${ruas.map(rua=>{
              const tot=ruaTotal.get(rua)||0;
              const nPred=ruaPredSet.get(rua)?.size||1;
              const media=tot/nPred;
              const pct=totalAtual>0?(tot/totalAtual*100):0;
              return `<tr>
                <td style="font-weight:700;color:#0b2647;">Rua ${escapeHtml(rua)}</td>
                <td style="font-weight:700;">${fmtNum(tot)}</td>
                <td>${fmtNum(nPred)}</td>
                <td style="font-weight:700;color:#1a4480;">${fmtNum(media,1)}</td>
                <td><div style="display:flex;align-items:center;gap:6px;">
                  <div style="flex:1;background:#e2e8f0;border-radius:4px;height:6px;"><div style="width:${Math.min(pct*3,100).toFixed(1)}%;background:#1a4480;height:6px;border-radius:4px;"></div></div>
                  <span style="font-size:10px;color:#7a8798;white-space:nowrap;">${pct.toFixed(1)}%</span>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- MÉDIAS POR BLOCO -->
    <div class="panel">
      <div class="panel-header"><h3>Média de O.S. por Bloco de Prédios</h3></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
        ${blocosComDados.map(b=>{
          const d=blocoMap.get(b);
          const media=d.ruaSet.size>0?d.total/d.ruaSet.size:0;
          const pct=totalAtual>0?(d.total/totalAtual*100):0;
          const cor = d.total===Math.max(...[...blocoMap.values()].map(x=>x.total))?'#0b2647':'#1a4480';
          return mc(`🏢 Prédios ${b}`,
            fmtNum(d.total)+' O.S.',
            `${d.ruaSet.size} ruas · ${d.predSet.size} prédios · média ${fmtNum(media,1)} OS/rua · ${pct.toFixed(1)}%`,
            cor);
        }).join('')}
      </div>
      <div class="table-wrap">
        <table class="data-table" style="font-size:11.5px;">
          <thead><tr><th>Bloco</th><th>Total O.S.</th><th>Ruas</th><th>Prédios</th><th>Média O.S./Rua</th><th>Média O.S./Prédio</th><th>% do Total</th></tr></thead>
          <tbody>
            ${blocosComDados.map(b=>{
              const d=blocoMap.get(b);
              const mediaRua=d.ruaSet.size>0?d.total/d.ruaSet.size:0;
              const mediaPred=d.predSet.size>0?d.total/d.predSet.size:0;
              const pct=totalAtual>0?(d.total/totalAtual*100):0;
              return `<tr>
                <td style="font-weight:700;color:#0b2647;">Prédios ${b}</td>
                <td style="font-weight:700;">${fmtNum(d.total)}</td>
                <td>${fmtNum(d.ruaSet.size)}</td>
                <td>${fmtNum(d.predSet.size)}</td>
                <td style="font-weight:700;color:#1a4480;">${fmtNum(mediaRua,1)}</td>
                <td style="color:#2f6fce;">${fmtNum(mediaPred,1)}</td>
                <td><div style="display:flex;align-items:center;gap:6px;">
                  <div style="flex:1;background:#e2e8f0;border-radius:4px;height:6px;"><div style="width:${pct.toFixed(1)}%;background:#0b2647;height:6px;border-radius:4px;"></div></div>
                  <span style="font-size:10px;color:#7a8798;">${pct.toFixed(1)}%</span>
                </div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- MAPA DE CALOR RUA × PRÉDIO -->
    <div class="panel av-page-break">
      <div class="panel-header">
        <h3>Mapa de Calor — Rua × Prédio (Destino)</h3>
        <span class="panel-note">${ruas.length} ruas · ${predios.length} prédios · ${fmtNum(totalAtual)} O.S. · cor = quantidade</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:10px;color:#7a8798;">Menos</span>
        <div style="flex:1;max-width:200px;height:12px;border-radius:4px;background:linear-gradient(to right,#eef4ff,#5b92e5,#0b2647);border:1px solid #dde3ea;"></div>
        <span style="font-size:10px;color:#7a8798;">Mais (máx: ${fmtNum(maxCell)})</span>
      </div>
      ${ruas.length===0?'<div class="hint-box">Sem dados de localização para o filtro selecionado.</div>':`
      <div style="overflow-x:auto;">
        <table style="border-collapse:collapse;min-width:100%;font-size:10px;">
          <thead>
            <tr>
              <!-- coluna de prédio/bloco -->
              <th style="padding:3px 6px;background:#f8fafc;border:1px solid #e2e8f0;font-size:9px;color:#7a8798;position:sticky;left:0;z-index:2;white-space:nowrap;">Préd. \\ Rua</th>
              ${ruas.map(r=>`<th style="padding:3px 4px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:700;text-align:center;color:#123a6b;min-width:28px;">${escapeHtml(r)}</th>`).join('')}
              <th style="padding:3px 6px;background:#f8fafc;border:1px solid #e2e8f0;font-size:9px;color:#7a8798;white-space:nowrap;">Total</th>
              <th style="padding:3px 6px;background:#f8fafc;border:1px solid #e2e8f0;font-size:9px;color:#7a8798;white-space:nowrap;">Média/Rua</th>
            </tr>
          </thead>
          <tbody>
            ${(()=>{
              // agrupa prédios por bloco
              const blocosPred = new Map();
              predios.forEach(p=>{
                const b=opBloco(p)||'?';
                if(!blocosPred.has(b)) blocosPred.set(b,[]);
                blocosPred.get(b).push(p);
              });
              let html='';
              // totais por rua (para linha de total final)
              const totPorRua = new Map(ruas.map(r=>[r,0]));
              // conta total por bloco
              const blocoTotHtml = new Map();
              for(const b of BLOCOS_ORD){
                const preds = blocosPred.get(b);
                if(!preds||!preds.length) continue;
                // Sub-cabeçalho de bloco
                const bTotal = preds.reduce((s,p)=>s+ruas.reduce((s2,r)=>s2+(rpMap.get(r+'|||'+p)||0),0),0);
                const bRuasComDados = ruas.filter(r=>preds.some(p=>rpMap.get(r+'|||'+p)));
                const bMedia = bRuasComDados.length?bTotal/bRuasComDados.length:0;
                html+=`<tr style="background:#1a4480;">
                  <td colspan="${ruas.length+3}" style="padding:3px 6px;font-size:9px;font-weight:800;color:#fff;position:sticky;left:0;">
                    🏢 Prédios ${b} &nbsp;·&nbsp; ${fmtNum(bTotal)} O.S. &nbsp;·&nbsp; média ${fmtNum(bMedia,1)} O.S./rua
                  </td>
                </tr>`;
                // Linhas de prédio
                preds.forEach(p=>{
                  const rowTotal = ruas.reduce((s,r)=>s+(rpMap.get(r+'|||'+p)||0),0);
                  if(!rowTotal) return;
                  const ruasComDados = ruas.filter(r=>rpMap.get(r+'|||'+p));
                  const media = ruasComDados.length?rowTotal/ruasComDados.length:0;
                  html+=`<tr>
                    <td style="padding:3px 6px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:700;color:#123a6b;position:sticky;left:0;white-space:nowrap;">Préd. ${escapeHtml(p)}</td>
                    ${ruas.map(r=>{
                      const v=rpMap.get(r+'|||'+p)||0;
                      totPorRua.set(r,(totPorRua.get(r)||0)+v);
                      const t=v/maxCell;
                      const bg=v?`rgb(${Math.round(11+(189-11)*(1-t))},${Math.round(38+(220-38)*(1-t))},${Math.round(71+(248-71)*(1-t))})`: '#f8fafc';
                      const tc=t>0.5?'#fff':'#1a4480';
                      return `<td style="padding:2px;border:1px solid #e2e8f0;background:${bg};text-align:center;font-weight:${v?'700':'400'};color:${tc};cursor:${v?'pointer':'default'};"
                        onclick="opHeatClick('${escapeHtml(r)}','${escapeHtml(p)}','rua','predio')"
                        title="Rua ${escapeHtml(r)} / Prédio ${escapeHtml(p)}: ${v} O.S.">${v||''}</td>`;
                    }).join('')}
                    <td style="padding:3px 4px;border:1px solid #e2e8f0;font-weight:800;color:#0b2647;text-align:center;background:#f0f4f8;">${fmtNum(rowTotal)}</td>
                    <td style="padding:3px 4px;border:1px solid #e2e8f0;color:#1a4480;text-align:center;background:#f0f4f8;">${fmtNum(media,1)}</td>
                  </tr>`;
                });
              }
              // Linha de total por rua (fixo no fundo)
              const totalGeral = [...totPorRua.values()].reduce((a,b)=>a+b,0);
              const mediaGeral = ruas.length?totalGeral/ruas.length:0;
              html+=`<tr style="border-top:2px solid #1a4480;">
                <td style="padding:3px 6px;background:#0b2647;color:#fff;font-weight:800;font-size:9px;position:sticky;left:0;">Total</td>
                ${ruas.map(r=>{
                  const t=totPorRua.get(r)||0;
                  return `<td style="padding:3px;background:#0b2647;color:#fff;text-align:center;font-weight:800;border:1px solid #1a4480;">${t||''}</td>`;
                }).join('')}
                <td style="padding:3px 6px;background:#0b2647;color:#fff;font-weight:800;text-align:center;">${fmtNum(totalGeral)}</td>
                <td style="padding:3px 6px;background:#0b2647;color:#fff;font-weight:800;text-align:center;">${fmtNum(mediaGeral,1)}</td>
              </tr>
              <tr>
                <td style="padding:3px 6px;background:#1a4480;color:#bcd4f8;font-weight:800;font-size:9px;position:sticky;left:0;">Média/Rua</td>
                ${ruas.map(r=>{
                  const t=totPorRua.get(r)||0;
                  const predsNaRua = predios.filter(p=>rpMap.get(r+'|||'+p)).length||1;
                  return `<td style="padding:3px;background:#1a4480;color:#bcd4f8;text-align:center;font-size:9px;border:1px solid #2f6fce;">${fmtNum(t/predsNaRua,1)}</td>`;
                }).join('')}
                <td colspan="2" style="background:#1a4480;"></td>
              </tr>`;
              return html;
            })()}
          </tbody>
        </table>
      </div>`}
    </div>

    <!-- DETALHE DO CLIQUE -->
    <div id="op-heat-detalhe"></div>

    <!-- RANKING OPERADORES -->
    <div class="panel">
      <div class="panel-header"><h3>Ranking de Operadores — Atual vs Anterior</h3></div>
      <div class="table-wrap">
        <table class="data-table" style="font-size:11.5px;">
          <thead><tr><th>#</th><th>Operador</th><th>O.S. Atual</th><th>QTD</th><th>Dias</th><th>O.S./Dia</th><th>O.S. Anterior</th><th>Var. Abs.</th><th>Var. %</th></tr></thead>
          <tbody>${rankAtual.map((op,i)=>{
            const ant=rankAntMap.get(op.codKey);
            const antTot=ant?ant.total:0;
            const dAbs=op.total-antTot;
            const dPct=antTot>0?((op.total-antTot)/antTot*100):null;
            const corV=dAbs>=0?'#1a9c62':'#d64545';
            return `<tr><td style="color:#7a8798;">${i+1}</td>
              <td><strong>${escapeHtml(op.nome)}</strong></td>
              <td style="font-weight:700;color:#0b2647;">${fmtNum(op.total)}</td>
              <td style="color:#1a4480;">${fmtNum(op.qtdTotal)}</td>
              <td>${fmtNum(op.dias)}</td>
              <td>${fmtNum(op.media,1)}</td>
              <td style="color:#7a8798;">${fmtNum(antTot)}</td>
              <td style="font-weight:700;color:${corV};">${dAbs>=0?'+':''}${fmtNum(dAbs)}</td>
              <td style="color:${dPct===null?'#7a8798':corV};">${dPct!==null?(dPct>=0?'▲ ':'▼ ')+Math.abs(dPct).toFixed(1)+'%':'—'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>
    </div>
  `;

  // Listeners
  $('#op-dt-ini')?.addEventListener('change',e=>{Op8457State.ini=e.target.value?new Date(e.target.value+'T00:00:00'):null;renderOperadores();});
  $('#op-dt-fim')?.addEventListener('change',e=>{Op8457State.fim=e.target.value?new Date(e.target.value+'T23:59:59'):null;renderOperadores();});
  $('#op-oper-select')?.addEventListener('change',e=>{Op8457State.filtroOp=e.target.value;renderOperadores();});

  // Gráfico comparativo
  setTimeout(()=>{
    const canvas=document.getElementById('op-chart-comp');
    if(!canvas||typeof Chart==='undefined') return;
    if(canvas._chartInstance){canvas._chartInstance.destroy();canvas._chartInstance=null;}
    const labSet=new Set([...serieAtual.map(s=>s.label),...serieAntP.map(s=>s.label)]);
    const labs=[...labSet].sort();
    const mA=new Map(serieAtual.map(s=>[s.label,s.total]));
    const mP=new Map(serieAntP.map(s=>[s.label,s.total]));
    canvas._chartInstance=new Chart(canvas.getContext('2d'),{
      type:'bar',
      data:{ labels:labs, datasets:[
        {label:'Período Atual',   data:labs.map(l=>mA.get(l)||0), backgroundColor:'#0b2647', borderRadius:5, borderSkipped:false},
        {label:'Período Anterior',data:labs.map(l=>mP.get(l)||0), backgroundColor:'#5b92e5', borderRadius:5, borderSkipped:false}
      ]},
      options:{responsive:true,maintainAspectRatio:false,
        layout:{padding:{top:30}},
        plugins:{
          legend:{display:true,position:'bottom',labels:{color:'#123a6b',font:{size:11}}},
          tooltip:{mode:'index',intersect:false},
          datalabels:{anchor:'end',align:'end',offset:4,clamp:true,
            color:ctx=>ctx.datasetIndex===0?'#0b2647':'#1a4480',
            font:{size:10,weight:'700'},formatter:v=>v>0?v:''}
        },
        scales:{x:{ticks:{color:'#7a8798',font:{size:10}},grid:{color:'#eef1f4'}},
          y:{ticks:{color:'#7a8798',font:{size:10}},grid:{color:'#eef1f4'},beginAtZero:true}}}
    });
  },80);
}

function opHeatClick(ruaVal, predVal, xField, yField) {
  const ini=Op8457State.ini||new Date(0);
  const fim=Op8457State.fim||new Date(9999,0,1);
  const rows=getRows8457(ini,fim,Op8457State.filtroOp)
    .filter(r=>String(r.rua||'')===String(ruaVal)&&String(r.predio||'')===String(predVal));
  const el=document.getElementById('op-heat-detalhe');
  if(!el) return;
  const registry=window.APP_STATE.nameRegistry;
  const opM=new Map();
  rows.forEach(r=>{const k=r.codKey||'?';const n=registry.get(k)||r.nome||k;opM.set(k+':'+n,(opM.get(k+':'+n)||0)+1);});
  const sorted=[...opM.entries()].sort((a,b)=>b[1]-a[1]);
  const totalQ=rows.reduce((s,r)=>s+(r.qtd||0),0);
  el.innerHTML=`<div class="panel" style="border-left:4px solid #1a4480;">
    <div class="panel-header">
      <h3>Rua <strong>${escapeHtml(ruaVal)}</strong> / Prédio <strong>${escapeHtml(predVal)}</strong> — ${rows.length} O.S. · ${fmtNum(totalQ)} unidades</h3>
      <button class="btn btn-outline btn-sm" onclick="document.getElementById('op-heat-detalhe').innerHTML=''">Fechar</button>
    </div>
    <div class="table-wrap"><table class="data-table" style="font-size:11.5px;">
      <thead><tr><th>Operador</th><th>O.S.</th></tr></thead>
      <tbody>${sorted.map(([kn,qtd])=>`<tr><td>${escapeHtml(kn.split(':').slice(1).join(':'))}</td><td style="font-weight:700;">${fmtNum(qtd)}</td></tr>`).join('')}</tbody>
    </table></div>
  </div>`;
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ================================================================== */
/* MODULE: Relações Rep (Indicadores → Relações Rep)                  */
/* 9712 filtrado por QUADRO REP × 8457 (RUA) × 8022 (DEPTO/TIPO)    */
/* ================================================================== */
const RelState = {
  ini: null, fim: null,
  busca: '',
  apenasRep:    true,  // só lançamentos do QUADRO REP
  apenasAvaria: true,  // só Num.Lançamento da REP.AVARIA
  sortCol: 'numLanc', sortDir: 1,
  paginaTabela: 0,
  TAM_PAG: 100
};

function relAtalho(tipo){
  const hoje = new Date();
  const y = hoje.getFullYear(), m = hoje.getMonth(); // mês atual real
  if(tipo==='mes_atual'){
    RelState.ini = new Date(y, m, 1);
    RelState.fim = new Date(y, m+1, 0); // último dia do mês atual
  } else if(tipo==='mes_ant'){
    RelState.ini = new Date(y, m-1, 1);
    RelState.fim = new Date(y, m, 0);   // último dia do mês anterior
  } else if(tipo==='ano_atual'){
    RelState.ini = new Date(y, 0, 1);
    RelState.fim = new Date(y, 11, 31);
  } else if(tipo==='ano_ant'){
    RelState.ini = new Date(y-1, 0, 1);
    RelState.fim = new Date(y-1, 11, 31);
  } else { // tudo
    RelState.ini = null;
    RelState.fim = null;
  }
  RelState.paginaTabela = 0;
  renderRelacoes();
}

function relRows(){
  const todos = window.APP_STATE.processed.p9712||[];
  let rows = RelState.apenasRep ? todos.filter(r=>r.soRep) : todos;
  // Filtra pelos Num.Lançamento validados na REP.AVARIA
  if(RelState.apenasAvaria){
    const numLancAvaria = window.APP_STATE.processed.numLancAvaria || new Set();
    rows = rows.filter(r=>r.numLanc && numLancAvaria.has(r.numLanc));
  }
  const ini = RelState.ini || new Date(0);
  const fim = RelState.fim || new Date(9999,0,1);
  rows = rows.filter(r=>{
    if(!r.dt) return true;
    const d=dateOnly(r.dt);
    return d>=ini && d<=fim;
  });
  if(RelState.busca){
    const b=RelState.busca.toLowerCase();
    rows=rows.filter(r=>(r.nome||'').toLowerCase().includes(b)||(r.descr||'').toLowerCase().includes(b)||(r.motivo||'').toLowerCase().includes(b)||(r.rua||'').toLowerCase().includes(b)||(r.depto||'').toLowerCase().includes(b)||(r.codProd||'').toLowerCase().includes(b));
  }
  return rows;
}

// Feriados nacionais fixos relevantes (formato 'MM-DD')
const FERIADOS_BR = ['01-01','04-21','05-01','09-07','10-12','11-02','11-15','12-25'];
function isDiaUtil(d){
  if(d.getDay()===0||d.getDay()===6) return false; // fim de semana
  const mmdd = `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return !FERIADOS_BR.includes(mmdd);
}
function diasUteisDoMes(ano, mes){
  let d=new Date(ano,mes,1), total=0;
  while(d.getMonth()===mes){ if(isDiaUtil(d)) total++; d=new Date(d.getTime()+86400000); }
  return total;
}
function diasUteisPassados(ano, mes, ateData){
  let d=new Date(ano,mes,1), total=0;
  const fim=new Date(Math.min(ateData.getTime(), new Date(ano,mes+1,0).getTime()));
  while(d<=fim){ if(isDiaUtil(d)) total++; d=new Date(d.getTime()+86400000); }
  return total;
}

function renderRelacoes(){
  const pane=$('#pane-relacoes');
  const proc=window.APP_STATE.processed;

  // Diagnóstico — verifica o que foi carregado da REP.AVARIA
  if(proc.numLancAvaria){
    console.log('[REP.AVARIA] Num.Lançamento carregados:', proc.numLancAvaria.size, [...proc.numLancAvaria].slice(0,10));
    console.log('[REP.AVARIA] Contém 597172?', proc.numLancAvaria.has('597172'));
    console.log('[REP.AVARIA] Contém 597160?', proc.numLancAvaria.has('597160'));
  }

  if(!proc.p9712dispo){
    pane.innerHTML=`<div class="warn-box">A aba <strong>9712</strong> não foi encontrada no arquivo.</div>`;
    return;
  }

  const rows=relRows();
  const fBRL=v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const fN=v=>Number(v||0).toLocaleString('pt-BR');
  const localDateKeyStr=d=>{const dt=d instanceof Date?d:new Date(d);return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;};
  const periodoStr=(()=>{
    const ini=RelState.ini,fim=RelState.fim;
    const fmt=d=>String(d.getDate()).padStart(2,'0')+'/'+MESES_PT[d.getMonth()]+'/'+d.getFullYear();
    if(!ini&&!fim) return 'Todos os dados';
    if(ini&&fim) return fmt(ini)+' a '+fmt(fim);
    if(ini) return 'a partir de '+fmt(ini);
    return 'até '+fmt(fim);
  })();

  // ---- KPIs ----
  const valorTotal   = rows.reduce((s,r)=>s+(r.isRecuperado?0:(r.valor||0)),0); // avaria líquida
  const valorRecup   = rows.reduce((s,r)=>s+(r.isRecuperado?(r.valor||0):0),0);
  const rowsAvaria   = rows.filter(r=>!r.isRecuperado);
  const rowsRecup    = rows.filter(r=>r.isRecuperado);
  const lancUnicos = new Set(rows.filter(r=>r.numLanc).map(r=>r.numLanc)).size;
  const funcUnicos = new Set(rows.filter(r=>r.funcLanc).map(r=>r.funcLanc)).size;
  const ticketMedio= lancUnicos>0 ? valorTotal/lancUnicos : 0;
  const qtdTotal   = rows.reduce((s,r)=>s+(r.qtd||0),0);
  const semValor   = rows.filter(r=>!r.valor).length; // sem valor ou descartado

  // ---- Rankings ----
  function ranking(rows, keyFn, labelFn, top=10){
    const m=new Map();
    rows.forEach(r=>{
      const k=keyFn(r); if(!k) return;
      const ex=m.get(k)||{key:k,label:labelFn?labelFn(r,k):k,total:0,valor:0,qtd:0};
      ex.total++; ex.valor+=(r.valor||0); ex.qtd+=(r.qtd||0);
      m.set(k,ex);
    });
    return [...m.values()].sort((a,b)=>b.valor-a.valor).slice(0,top);
  }

  const rkProd    = ranking(rows, r=>r.codProd, r=>`${r.codProd} — ${r.descr||''}`);
  const rkMotivo  = ranking(rows, r=>r.motivo,  r=>r.motivo);
  const rkRua     = ranking(rows, r=>r.rua,     r=>`Rua ${r.rua}`);
  const rkDepto   = ranking(rows, r=>r.depto,   r=>r.depto);
  const rkSetor   = ranking(rows, r=>r.setor,   r=>r.setor);
  const rkUnidade = ranking(rows, r=>r.unidade, r=>r.unidade);

  // Série mensal
  const serieMes=new Map();
  rows.forEach(r=>{
    if(!r.dt) return;
    const k=`${r.dt.getFullYear()}-${String(r.dt.getMonth()+1).padStart(2,'0')}`;
    const lb=MESES_PT[r.dt.getMonth()]+'/'+String(r.dt.getFullYear()).slice(2);
    const ex=serieMes.get(k)||{key:k,label:lb,valor:0,total:0,lancamentos:new Set()};
    ex.valor+=(r.valor||0); ex.total++; if(r.numLanc) ex.lancamentos.add(r.numLanc);
    serieMes.set(k,ex);
  });
  const serie=[...serieMes.values()].sort((a,b)=>a.key.localeCompare(b.key));

  // datas limite para atalhos
  const dts=rows.filter(r=>r.dt).map(r=>r.dt);
  const maxD=dts.length?new Date(Math.max(...dts)):new Date();
  const minD=dts.length?new Date(Math.min(...dts)):new Date();
  const y=maxD.getFullYear(),m2=maxD.getMonth();
  const iniStr=RelState.ini?RelState.ini.toISOString().slice(0,10):'';
  const fimStr=RelState.fim?RelState.fim.toISOString().slice(0,10):'';
  const hoje = new Date();
  const yH = hoje.getFullYear(), mH = hoje.getMonth();
  const isAtivo=(tipo)=>{
    if(tipo==='tudo')      return !iniStr&&!fimStr;
    if(tipo==='mes_atual') return iniStr===new Date(yH,mH,1).toISOString().slice(0,10)
                                && fimStr===new Date(yH,mH+1,0).toISOString().slice(0,10);
    if(tipo==='mes_ant')   return iniStr===new Date(yH,mH-1,1).toISOString().slice(0,10)
                                && fimStr===new Date(yH,mH,0).toISOString().slice(0,10);
    if(tipo==='ano_atual') return iniStr===new Date(yH,0,1).toISOString().slice(0,10)
                                && fimStr===new Date(yH,11,31).toISOString().slice(0,10);
    if(tipo==='ano_ant')   return iniStr===new Date(yH-1,0,1).toISOString().slice(0,10)
                                && fimStr===new Date(yH-1,11,31).toISOString().slice(0,10);
    return false;
  };

  const mc=(label,value,sub='',cor='#123a6b')=>
    `<div class="card" style="flex:1;min-width:130px;">
      <div class="card-label">${label}</div>
      <div class="card-value" style="color:${cor};">${value}</div>
      ${sub?`<div class="card-sub">${sub}</div>`:''}
    </div>`;

  // campo de filtro por tipo de ranking: mapeia o campo do objeto row
  const rkField = { 'Produto':'codProd', 'Motivo':'motivo', 'Rua':'rua', 'Depto':'depto', 'Master':'unidade', 'Setor':'setor' };

  const rkTable=(items,title,colValor='Valor',colLabel='Item')=>`
    <div style="margin-bottom:4px;">
      <div style="font-size:11px;font-weight:700;color:#1a4480;margin-bottom:6px;">${title}</div>
      <table class="data-table" style="font-size:11px;">
        <thead><tr><th>#</th><th>${colLabel}</th><th>Qtd</th><th>${colValor}</th><th style="width:24px;"></th></tr></thead>
        <tbody>${items.map((it,i)=>`
          <tr class="clickable" onclick="relDrillDown('${escapeHtml(rkField[colLabel]||colLabel)}','${escapeHtml(it.key)}','${escapeHtml(it.label)}','${escapeHtml(title)}','${escapeHtml(colLabel)}')"
              style="transition:background .15s;" title="Clique para ver detalhes">
            <td style="color:#7a8798;">${i+1}</td>
            <td><strong>${escapeHtml(it.label)}</strong></td>
            <td>${fN(it.total)}</td>
            <td style="font-weight:700;color:#0b2647;">${fBRL(it.valor)}</td>
            <td style="color:#5b92e5;font-size:13px;">▶</td>
          </tr>
          <tr id="rel-drill-${escapeHtml(rkField[colLabel]||colLabel)}-${escapeHtml(it.key)}" style="display:none;">
            <td colspan="5" style="padding:0;background:#f0f5ff;"></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  // ---- Cards fixos de comparação temporal (usam TODOS os dados, ignoram filtro de período) ----
  const todosRel = (() => {
    const t = window.APP_STATE.processed.p9712||[];
    let r = RelState.apenasRep ? t.filter(r=>r.soRep) : t;
    if(RelState.apenasAvaria){
      const nla = window.APP_STATE.processed.numLancAvaria||new Set();
      r = r.filter(row=>row.numLanc && nla.has(row.numLanc));
    }
    return r;
  })();
  const hojeCards = new Date();
  const yCd=hojeCards.getFullYear(), mCd=hojeCards.getMonth();
  const mesAtualIni = new Date(yCd, mCd, 1);
  const mesAtualFim = new Date(yCd, mCd+1, 0, 23,59,59);
  const mesAntIni   = new Date(yCd, mCd-1, 1);
  const mesAntFim   = new Date(yCd, mCd, 0, 23,59,59);

  const somarValor = arr => arr.reduce((s,r)=>s+(r.isRecuperado?0:(r.valor||0)), 0);
  const inRange = (r, ini, fim) => r.dt && dateOnly(r.dt)>=dateOnly(ini) && dateOnly(r.dt)<=dateOnly(fim);

  // Projetado mês atual — usa dias úteis reais (Mon-Sex, exclui feriados)
  const vMesAtualAcum = somarValor(todosRel.filter(r=>inRange(r,mesAtualIni,mesAtualFim)));
  const valorRecupMes = todosRel.filter(r=>r.isRecuperado&&inRange(r,mesAtualIni,mesAtualFim)).reduce((s,r)=>s+(r.valor||0),0);
  const uteisTotalMes  = diasUteisDoMes(yCd, mCd);
  const uteisPasados   = diasUteisPassados(yCd, mCd, hojeCards);
  const mediaDia       = uteisPasados>0 ? vMesAtualAcum/uteisPasados : 0;
  const vProjetado     = mediaDia * uteisTotalMes;

  const vMesAtual  = vMesAtualAcum;
  const vMesAnt   = somarValor(todosRel.filter(r=>inRange(r, mesAntIni,   mesAntFim)));
  const diffMes   = vMesAnt>0 ? (vMesAtual-vMesAnt)/vMesAnt*100 : null;
  const diffMesAbs = vMesAtual - vMesAnt;

  // Ontem e anteontem — busca os 2 dias úteis mais recentes com dados
  const diasComDados = [...new Set(todosRel.filter(r=>r.dt).map(r=>dateOnly(r.dt).toISOString().slice(0,10)))].sort();
  const dOntem     = diasComDados.length>=1 ? diasComDados[diasComDados.length-1] : null;
  const dAnteontem = diasComDados.length>=2 ? diasComDados[diasComDados.length-2] : null;
  const vOntem     = dOntem     ? somarValor(todosRel.filter(r=>r.dt&&r.dt.toISOString().slice(0,10)===dOntem))     : 0;
  const vAnteontem = dAnteontem ? somarValor(todosRel.filter(r=>r.dt&&r.dt.toISOString().slice(0,10)===dAnteontem)) : 0;
  const diffDia    = vAnteontem>0 ? (vOntem-vAnteontem)/vAnteontem*100 : null;
  const diffDiaAbs = vOntem - vAnteontem;

  const fmtMes = (d) => MESES_PT[d.getMonth()]+'/'+String(d.getFullYear()).slice(2);
  const mcComp = (icon, titulo, valor, anterior, diffPct, diffAbs, subLabel) => {
    const cor   = diffAbs===null?'#123a6b':diffAbs>=0?'#d64545':'#1a9c62';
    const seta  = diffAbs===null?'':diffAbs>=0?'▲':'▼';
    const pctStr= diffPct!==null ? `${seta} ${Math.abs(diffPct).toFixed(1)}%` : '—';
    const absStr= diffAbs!==null ? (diffAbs>=0?'+':'')+fBRL(diffAbs) : '';
    return `<div class="card" style="flex:1;min-width:160px;border-left:4px solid ${cor};">
      <div class="card-label">${icon} ${titulo}</div>
      <div class="card-value" style="color:#0b2647;">${fBRL(valor)}</div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:4px;">
        <span style="font-size:13px;font-weight:800;color:${cor};">${pctStr}</span>
        <span style="font-size:10px;color:#7a8798;">${absStr}</span>
      </div>
      <div class="card-sub">${subLabel}</div>
    </div>`;
  };
  const lancMap = new Map();
  rows.forEach(r=>{
    if(!r.numLanc) return;
    const ex = lancMap.get(r.numLanc) || {numLanc:r.numLanc, nome:r.nome, funcLanc:r.funcLanc, dt:r.dt, setor:r.setor, itens:0, qtd:0, valor:0, produtos:[]};
    ex.itens++;
    ex.qtd   += (r.qtd||0);
    ex.valor += (r.valor||0);
    ex.produtos.push(r);
    if(!ex.dt && r.dt) ex.dt = r.dt;
    lancMap.set(r.numLanc, ex);
  });
  const relLancSort = window._relLancSort || {col:'valor', dir:-1};
  window._relLancSort = relLancSort;
  const lancRows = [...lancMap.values()].sort((a,b)=>{
    const va=a[relLancSort.col]??0, vb=b[relLancSort.col]??0;
    if(va instanceof Date && vb instanceof Date) return (va-vb)*relLancSort.dir;
    if(typeof va==='number') return (va-vb)*relLancSort.dir;
    return String(va).localeCompare(String(vb))*relLancSort.dir;
  });
  const sortedRows = [...rows].sort((a,b)=>{
    // Ordenação primária pelo sortCol clicado
    if(RelState.sortCol!=='numLanc' && RelState.sortCol!=='valor'){
      const va=a[RelState.sortCol]??'', vb=b[RelState.sortCol]??'';
      if(va instanceof Date && vb instanceof Date) return (va-vb)*RelState.sortDir;
      if(typeof va==='number') return (va-vb)*RelState.sortDir;
      return String(va).localeCompare(String(vb))*RelState.sortDir;
    }
    // Padrão e sort por numLanc/valor: numLanc asc → valor desc
    const la = String(a.numLanc||''), lb = String(b.numLanc||'');
    const cmpLanc = la.localeCompare(lb, undefined, {numeric:true}) * (RelState.sortCol==='numLanc'?RelState.sortDir:1);
    if(cmpLanc!==0) return cmpLanc;
    // segundo critério: valor desc
    return ((b.valor||0)-(a.valor||0)) * (RelState.sortCol==='valor'?RelState.sortDir:1);
  });
  const pag=RelState.paginaTabela;
  const tamPag=RelState.TAM_PAG;
  const paginadas=sortedRows.slice(pag*tamPag,(pag+1)*tamPag);
  const totalPags=Math.max(1,Math.ceil(sortedRows.length/tamPag));
  const thSort=(col,label)=>
    `<th onclick="relSort('${col}')" style="cursor:pointer;white-space:nowrap;">
      ${label}${RelState.sortCol===col?(RelState.sortDir>0?' ▲':' ▼'):''}
    </th>`;

  pane.innerHTML=`
    <!-- FILTROS -->
    <div class="panel pdf-hide-geral">
      <div class="panel-header">
        <h3>Relações Rep — Lançamentos por Repositores</h3>
        <div class="panel-actions" style="gap:5px;flex-wrap:wrap;">
          ${renderAtalhos(atalhoAtivoPorDatas(RelState.ini,RelState.fim),'relAtalho')}
          <button onclick="relExportarPDF()" style="padding:5px 14px;font-size:11px;font-weight:700;border-radius:6px;border:1.5px solid #d64545;background:#fff;color:#d64545;cursor:pointer;">Exportar PDF</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="filter-group"><label>Data Inicial</label>
          <input type="date" id="rel-dt-ini" value="${iniStr}"></div>
        <div class="filter-group"><label>Data Final</label>
          <input type="date" id="rel-dt-fim" value="${fimStr}"></div>
        <div class="filter-group" style="flex:2;"><label>Busca (funcionário, produto, motivo, rua, depto)</label>
          <input type="text" id="rel-busca" value="${escapeHtml(RelState.busca)}" placeholder="Digite para filtrar..."></div>
        <div class="filter-group">
          <label>Apenas Reposição?</label>
          <div style="display:flex;gap:4px;">
            ${renderAtalhos(null,'',[])}
            <button onclick="RelState.apenasRep=true;RelState.paginaTabela=0;renderRelacoes();"
              style="padding:5px 14px;font-size:11px;font-weight:${RelState.apenasRep?'800':'600'};border-radius:6px;
                     border:1.5px solid ${RelState.apenasRep?'#0b2647':'#b8c4d4'};
                     background:${RelState.apenasRep?'#0b2647':'#fff'};
                     color:${RelState.apenasRep?'#fff':'#1a4480'};cursor:pointer;">Sim</button>
            <button onclick="RelState.apenasRep=false;RelState.paginaTabela=0;renderRelacoes();"
              style="padding:5px 14px;font-size:11px;font-weight:${!RelState.apenasRep?'800':'600'};border-radius:6px;
                     border:1.5px solid ${!RelState.apenasRep?'#0b2647':'#b8c4d4'};
                     background:${!RelState.apenasRep?'#0b2647':'#fff'};
                     color:${!RelState.apenasRep?'#fff':'#1a4480'};cursor:pointer;">Não</button>
          </div>
        </div>
        <div class="filter-group">
          <label>Apenas REP.AVARIA?</label>
          <div style="display:flex;gap:4px;">
            <button onclick="RelState.apenasAvaria=true;RelState.paginaTabela=0;renderRelacoes();"
              style="padding:5px 14px;font-size:11px;font-weight:${RelState.apenasAvaria?'800':'600'};border-radius:6px;
                     border:1.5px solid ${RelState.apenasAvaria?'#1a4480':'#b8c4d4'};
                     background:${RelState.apenasAvaria?'#1a4480':'#fff'};
                     color:${RelState.apenasAvaria?'#fff':'#1a4480'};cursor:pointer;">Sim</button>
            <button onclick="RelState.apenasAvaria=false;RelState.paginaTabela=0;renderRelacoes();"
              style="padding:5px 14px;font-size:11px;font-weight:${!RelState.apenasAvaria?'800':'600'};border-radius:6px;
                     border:1.5px solid ${!RelState.apenasAvaria?'#0b2647':'#b8c4d4'};
                     background:${!RelState.apenasAvaria?'#0b2647':'#fff'};
                     color:${!RelState.apenasAvaria?'#fff':'#1a4480'};cursor:pointer;">Não</button>
          </div>
        </div>
      </div>
    </div>

    <div id="rel-pdf-p1-cards">
    <!-- KPIs -->
    <div class="panel">
      <!-- Cards fixos de comparação temporal -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
        ${mc('🗓️ Mês Atual', fBRL(vMesAtual), fmtMes(new Date(yCd,mCd,1))+' · avaria acumulada', '#1a4480')}
        ${mcComp('📅 Mês Anterior', fmtMes(new Date(yCd,mCd-1,1)), vMesAnt, vMesAtual, diffMes, -diffMesAbs, `vs ${fmtMes(new Date(yCd,mCd,1))}: ${fBRL(vMesAtual)}`)}
        ${mcComp('📆 Dia Anterior', dOntem?dOntem.split('-').reverse().join('/'):'—', vOntem, vAnteontem, diffDia, diffDiaAbs, `vs ${dAnteontem?dAnteontem.split('-').reverse().join('/'):'—'}: ${fBRL(vAnteontem)}`)}
        <div class="card" style="flex:1;min-width:160px;border-left:4px solid #2f6fce;">
          <div class="card-label">📈 Projetado ${fmtMes(new Date(yCd,mCd,1))}</div>
          <div class="card-value" style="color:#2f6fce;">${fBRL(vProjetado)}</div>
          <div style="font-size:10px;color:#7a8798;margin-top:4px;">
            R$ ${mediaDia.toLocaleString('pt-BR',{minimumFractionDigits:2})}/dia útil
            · ${uteisPasados}/${uteisTotalMes} dias úteis
          </div>
        </div>
        ${valorRecupMes>0 ? `<div class="card" style="flex:1;min-width:160px;border-left:4px solid #1a9c62;background:#f0fdf4;">
          <div class="card-label">♻️ Recuperado ${fmtMes(new Date(yCd,mCd,1))}</div>
          <div class="card-value" style="color:#1a9c62;">${fBRL(valorRecupMes)}</div>
          <div style="font-size:10px;color:#1a9c62;margin-top:4px;">evitado de virar avaria</div>
        </div>` : ''}
      </div>
      <!-- KPIs do período filtrado -->
      <div style="font-size:10px;color:#7a8798;font-weight:700;text-transform:uppercase;margin-bottom:6px;padding-top:8px;border-top:1px solid #eef1f4;">Período selecionado</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${mc('💰 Valor Total', fBRL(valorTotal), `${fN(rows.length)} registros · ${semValor} sem valor`, '#1a9c62')}
        ${mc('📋 Lançamentos', fN(lancUnicos), 'únicos')}
        ${mc('👷 Funcionários', fN(funcUnicos), 'repositores envolvidos')}
        ${mc('📦 Quantidade', fN(qtdTotal), 'itens')}
        ${mc('🎯 Ticket Médio', fBRL(ticketMedio), 'por lançamento', '#0b2647')}
        ${mc('📍 Com RUA/DEPTO', fN(rows.filter(r=>r.rua).length), `${rows.filter(r=>!r.rua).length} sem cruzamento 8022`)}
      </div>
    </div>

    <div id="rel-pdf-p1-top">
    <!-- TOP PRODUTOS DIA ANTERIOR -->
    <div class="panel">
      <div class="panel-header">
        <h3>Top Produtos por Valor — Dia Anterior${dOntem?' ('+dOntem.split('-').reverse().join('/')+')':''}</h3>
        <span class="panel-note">Base: todos os dados filtrados · excl. Recuperação</span>
      </div>
      ${(()=>{
        if(!dOntem) return '<div class="hint-box">Sem dados do dia anterior.</div>';
        const rowsDia = todosRel.filter(r=>!r.isRecuperado&&r.dt&&localDateKeyStr(r.dt)===dOntem);
        if(!rowsDia.length) return '<div class="hint-box">Sem lançamentos no dia anterior.</div>';
        const pm = new Map();
        rowsDia.forEach(r=>{
          const k = r.codProd||'—';
          const ex = pm.get(k)||{codProd:k,descr:r.descr||'—',motivos:new Set(),ruas:new Set(),qtd:0,valor:0,regs:0};
          ex.qtd+=(r.qtd||0); ex.valor+=(r.valor||0); ex.regs++;
          if(r.motivo) ex.motivos.add(r.motivo);
          if(r.rua) ex.ruas.add(r.rua);
          pm.set(k,ex);
        });
        const top = [...pm.values()].sort((a,b)=>b.valor-a.valor).slice(0,15);
        const totalDia = rowsDia.reduce((s,r)=>s+(r.valor||0),0);
        return `<div class="table-wrap">
          <table class="data-table" style="font-size:11px;">
            <thead><tr>
              <th>#</th><th>Cód.</th><th>Produto</th><th>Motivo(s)</th>
              <th>Rua(s)</th><th>Qtd</th><th>Regs</th>
              <th>Valor</th><th>% do Dia</th>
            </tr></thead>
            <tbody>${top.map((p,i)=>{
              const pct=totalDia>0?(p.valor/totalDia*100):0;
              return `<tr>
                <td style="color:#7a8798;">${i+1}</td>
                <td style="font-size:10px;color:#7a8798;">${escapeHtml(p.codProd)}</td>
                <td><strong>${escapeHtml(p.descr)}</strong></td>
                <td style="font-size:10px;">${escapeHtml([...p.motivos].join(', ')||'—')}</td>
                <td style="font-size:10px;font-weight:700;color:#1a4480;">${[...p.ruas].sort().map(r=>'Rua '+r).join(', ')||'—'}</td>
                <td style="text-align:right;">${fN(p.qtd)}</td>
                <td style="text-align:center;color:#7a8798;">${p.regs}</td>
                <td style="font-weight:700;color:#0b2647;text-align:right;">${fBRL(p.valor)}</td>
                <td><div style="display:flex;align-items:center;gap:5px;">
                  <div style="flex:1;background:#e2e8f0;border-radius:3px;height:5px;">
                    <div style="width:${Math.min(pct*2,100).toFixed(1)}%;background:#1a4480;height:5px;border-radius:3px;"></div>
                  </div>
                  <span style="font-size:10px;color:#7a8798;white-space:nowrap;">${pct.toFixed(1)}%</span>
                </div></td>
              </tr>`;
            }).join('')}</tbody>
            <tfoot><tr style="background:#0b2647;color:#fff;font-size:10px;">
              <td colspan="5" style="padding:4px 8px;font-weight:800;">TOTAL DIA</td>
              <td style="text-align:right;font-weight:800;">${fN(rowsDia.reduce((s,r)=>s+(r.qtd||0),0))}</td>
              <td style="text-align:center;font-weight:800;">${rowsDia.length}</td>
              <td style="text-align:right;font-weight:800;">${fBRL(totalDia)}</td>
              <td></td>
            </tr></tfoot>
          </table>
        </div>`;
      })()}
    </div>

    </div><!-- /rel-pdf-p1-top -->

    <div id="rel-pdf-p2">
    <!-- SEÇÃO RECUPERAÇÃO -->
    ${(()=>{
      const totalRecup = rowsRecup.reduce((s,r)=>s+(r.valor||0),0);
      const totalAvaria = rowsAvaria.reduce((s,r)=>s+(r.valor||0),0);
      const pctEvitado = (totalAvaria+totalRecup)>0 ? totalRecup/(totalAvaria+totalRecup)*100 : 0;
      if(totalRecup===0 && rowsRecup.length===0) return `
        <div class="hint-box">♻️ Nenhum registro com motivo <strong>RECUPERADO (REP) STO</strong> no período selecionado.</div>`;
      return `
      <div class="panel" style="border-left:4px solid #1a9c62;">
        <div class="panel-header">
          <h3>Recuperação — Avaria Evitada</h3>
          <span class="panel-note">Motivo: RECUPERADO (REP) STO · excluído do total de avaria · gráfico: Evitado × Avaria dia a dia</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
          <div class="card" style="flex:1;min-width:160px;border-left:4px solid #1a9c62;background:#f0fdf4;">
            <div class="card-label">♻️ Total Recuperado</div>
            <div class="card-value" style="color:#1a9c62;">${fBRL(totalRecup)}</div>
            <div class="card-sub">${rowsRecup.length} registros evitados de avaria</div>
          </div>
          <div class="card" style="flex:1;min-width:160px;border-left:4px solid #d64545;">
            <div class="card-label">⚠️ Avaria Líquida</div>
            <div class="card-value" style="color:#d64545;">${fBRL(totalAvaria)}</div>
            <div class="card-sub">${rowsAvaria.length} registros · sem recuperação</div>
          </div>
          <div class="card" style="flex:1;min-width:160px;border-left:4px solid #2f6fce;">
            <div class="card-label">📊 % Recuperado</div>
            <div class="card-value" style="color:#2f6fce;">${pctEvitado.toFixed(1)}%</div>
            <div class="card-sub">do valor bruto foi recuperado</div>
          </div>
          <div class="card" style="flex:1;min-width:160px;">
            <div class="card-label">📦 Total Bruto</div>
            <div class="card-value">${fBRL(totalAvaria+totalRecup)}</div>
            <div class="card-sub">avaria + recuperado</div>
          </div>
        </div>
        <div style="height:280px;"><canvas id="rel-chart-recup"></canvas></div>

        <!-- RECUPERADOS DO DIA ANTERIOR -->
        ${(()=>{
          const rowsRecupDia = todosRel.filter(r=>r.isRecuperado&&r.dt&&localDateKeyStr(r.dt)===dOntem);
          const diaLabel = dOntem?dOntem.split('-').reverse().join('/'):'—';
          if(!rowsRecupDia.length) return `<div class="hint-box" style="margin-top:10px;">♻️ Sem recuperações registradas em ${diaLabel}.</div>`;
          const pm=new Map();
          rowsRecupDia.forEach(r=>{
            const k=r.codProd||'—';
            const ex=pm.get(k)||{codProd:k,descr:r.descr||'—',motivos:new Set(),ruas:new Set(),qtd:0,valor:0};
            ex.qtd+=(r.qtd||0); ex.valor+=(r.valor||0);
            if(r.motivo) ex.motivos.add(r.motivo);
            if(r.rua) ex.ruas.add(r.rua);
            pm.set(k,ex);
          });
          const top=[...pm.values()].sort((a,b)=>b.valor-a.valor);
          const totalR=rowsRecupDia.reduce((s,r)=>s+(r.valor||0),0);
          return `<div style="margin-top:14px;">
            <div style="font-size:11px;font-weight:800;color:#1a9c62;margin-bottom:8px;">
              ♻️ Recuperados do Dia Anterior — ${diaLabel}
            </div>
            <div class="table-wrap"><table class="data-table" style="font-size:11px;">
              <thead><tr><th>#</th><th>Produto</th><th>Motivo</th><th>Rua(s)</th><th>Qtd</th><th>Valor</th></tr></thead>
              <tbody>${top.map((p,i)=>`<tr>
                <td style="color:#7a8798;">${i+1}</td>
                <td><strong>${escapeHtml(p.descr)}</strong></td>
                <td style="font-size:10px;">${escapeHtml([...p.motivos].join(', ')||'—')}</td>
                <td style="font-size:10px;color:#1a4480;font-weight:700;">${[...p.ruas].sort().map(r=>'Rua '+r).join(', ')||'—'}</td>
                <td style="text-align:right;">${fN(p.qtd)}</td>
                <td style="font-weight:700;color:#1a9c62;text-align:right;">${fBRL(p.valor)}</td>
              </tr>`).join('')}</tbody>
              <tfoot><tr style="background:#1a9c62;color:#fff;font-size:10px;">
                <td colspan="4" style="padding:4px 8px;font-weight:800;">TOTAL RECUPERADO</td>
                <td style="text-align:right;font-weight:800;">${fN(rowsRecupDia.reduce((s,r)=>s+(r.qtd||0),0))}</td>
                <td style="text-align:right;font-weight:800;">${fBRL(totalR)}</td>
              </tr></tfoot>
            </table></div>
          </div>`;
        })()}
      </div>`;
    })()}


    </div><!-- /rel-pdf-p2 -->

    <div id="rel-pdf-p4">
    <!-- GRÁFICOS TEMPORAIS -->
    <div class="panel">
      <div class="panel-header"><h3>Dia a Dia — Valor e Quantidade</h3></div>
      <div style="height:280px;"><canvas id="rel-chart-dia"></canvas></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="panel">
        <div class="panel-header"><h3>Semana a Semana</h3></div>
        <div style="height:280px;"><canvas id="rel-chart-semana"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Mês a Mês</h3></div>
        <div style="height:280px;"><canvas id="rel-chart-mes"></canvas></div>
      </div>
    </div>

    </div><!-- /rel-pdf-p4 -->

    <!-- TOGGLE DETALHAMENTO -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
      <button id="rel-toggle-det" onclick="relToggleDetalhamento()"
        style="padding:6px 16px;font-size:12px;font-weight:700;border-radius:6px;
               border:1.5px solid #1a4480;background:#fff;color:#1a4480;
               cursor:pointer;display:flex;align-items:center;gap:6px;">
        <span id="rel-det-icon">▶</span>
        <span id="rel-det-label">Mostrar detalhamento</span>
      </button>
      <span style="font-size:11px;color:#7a8798;">Rankings, lançamentos e registros ocultos por padrão</span>
    </div>

    <!-- DETALHAMENTO (oculto por padrão) -->
    <div id="rel-det-wrap" style="display:none;">

    <!-- RANKINGS (ocultos por padrão) -->
    <div id="rel-pdf-p3">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div class="panel">${rkTable(rkProd,    '🏆 Top Produtos · '+periodoStr,  'Valor', 'Produto')}</div>
      <div class="panel">${rkTable(rkMotivo,  '📌 Top Motivos · '+periodoStr,   'Valor', 'Motivo')}</div>
      <div class="panel">${rkTable(rkRua,     '🏘️ Top Ruas · '+periodoStr,      'Valor', 'Rua')}</div>
      <div class="panel">${rkTable(rkDepto,   '🏢 Por Departamento · '+periodoStr,'Valor', 'Depto')}</div>
      <div class="panel">${rkTable(rkUnidade, '📦 Master · '+periodoStr,         'Valor', 'Master')}</div>
      <div class="panel">${rkTable(rkSetor,   '⚙️ Por Setor · '+periodoStr,      'Valor', 'Setor')}</div>
    </div>
    </div><!-- /rel-pdf-p3 -->

    <!-- TABELA POR LANÇAMENTO -->
    <div class="panel">
      <div class="panel-header">
        <h3>Por Num. Lançamento — ${fN(lancUnicos)} lançamentos</h3>
        <span class="panel-note">Clique numa linha para ver os itens do lançamento</span>
      </div>
      <div class="table-wrap">
        <table class="data-table" style="font-size:11.5px;">
          <thead><tr>
            <th onclick="relSortLanc('dt')"    style="cursor:pointer;">Data ${relLancSort.col==='dt'   ?(relLancSort.dir>0?'▲':'▼'):''}</th>
            <th onclick="relSortLanc('numLanc')"style="cursor:pointer;">Num. Lançamento ${relLancSort.col==='numLanc'?(relLancSort.dir>0?'▲':'▼'):''}</th>
            <th onclick="relSortLanc('nome')"  style="cursor:pointer;">Funcionário ${relLancSort.col==='nome'  ?(relLancSort.dir>0?'▲':'▼'):''}</th>
            <th>Setor</th>
            <th onclick="relSortLanc('itens')" style="cursor:pointer;text-align:center;">Itens ${relLancSort.col==='itens' ?(relLancSort.dir>0?'▲':'▼'):''}</th>
            <th onclick="relSortLanc('qtd')"   style="cursor:pointer;text-align:center;">Qtd ${relLancSort.col==='qtd'   ?(relLancSort.dir>0?'▲':'▼'):''}</th>
            <th onclick="relSortLanc('valor')"  style="cursor:pointer;text-align:right;">Valor Total ${relLancSort.col==='valor' ?(relLancSort.dir>0?'▲':'▼'):''}</th>
            <th style="width:20px;"></th>
          </tr></thead>
          <tbody>
            ${lancRows.map((l,i)=>`
              <tr class="clickable" onclick="relToggleLanc('${escapeHtml(l.numLanc)}')" title="Clique para ver itens">
                <td>${l.dt?fmtDateBR(l.dt):'—'}</td>
                <td style="font-weight:700;color:#0b2647;">${escapeHtml(l.numLanc)}</td>
                <td>${escapeHtml(l.nome||'—')}</td>
                <td style="font-size:10px;color:#7a8798;">${escapeHtml(l.setor||'—')}</td>
                <td style="text-align:center;">${fN(l.itens)}</td>
                <td style="text-align:center;">${fN(l.qtd)}</td>
                <td style="font-weight:700;color:#1a9c62;text-align:right;">${fBRL(l.valor)}</td>
                <td style="color:#5b92e5;">▶</td>
              </tr>
              <tr id="rel-lanc-${escapeHtml(l.numLanc)}" style="display:none;">
                <td colspan="8" style="padding:0;background:#f0f5ff;"></td>
              </tr>`).join('')}
          </tbody>
          <tfoot><tr style="background:#0b2647;color:#fff;font-size:11px;">
            <td colspan="4" style="padding:5px 8px;font-weight:800;">TOTAL</td>
            <td style="text-align:center;font-weight:800;">${fN(rows.reduce((s,r)=>s+1,0))}</td>
            <td style="text-align:center;font-weight:800;">${fN(qtdTotal)}</td>
            <td style="text-align:right;font-weight:800;">${fBRL(valorTotal)}</td>
            <td></td>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- TABELA DETALHADA -->
    <div class="panel">
      <div class="panel-header">
        <h3>Tabela Detalhada — ${fN(sortedRows.length)} registros</h3>
        <span class="panel-note">Página ${pag+1}/${totalPags} · ${fN(tamPag)} por página</span>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="relPag(-1)" ${pag<=0?'disabled':''}>◀ Anterior</button>
        <button class="btn btn-outline btn-sm" onclick="relPag(1)"  ${pag>=totalPags-1?'disabled':''}>Próxima ▶</button>
      </div>
      <div class="table-wrap" style="font-size:10.5px;">
        <table class="data-table" style="font-size:10.5px;">
          <thead><tr>
            ${thSort('dt','Data')}
            ${thSort('nome','Funcionário')}
            <th>Cód.Func</th>
            ${thSort('numLanc','Num.Lanç.')}
            ${thSort('codProd','Cód.Prod.')}
            ${thSort('descr','Produto')}
            ${thSort('motivo','Motivo')}
            ${thSort('setor','Setor')}
            ${thSort('rua','Rua')}
            ${thSort('depto','DEPTO')}
            ${thSort('unidade','UNIDADE')}
            ${thSort('qtd','Quantidade')}
            ${thSort('valor','Valor Total')}
          </tr></thead>
          <tbody>
            ${paginadas.map(r=>`<tr>
              <td>${r.dt?fmtDateBR(r.dt):'—'}</td>
              <td>${escapeHtml(r.nome||'—')}</td>
              <td style="color:#7a8798;">${escapeHtml(r.funcLanc||'—')}</td>
              <td>${escapeHtml(r.numLanc||'—')}</td>
              <td style="color:#7a8798;">${escapeHtml(r.codProd||'—')}</td>
              <td>${escapeHtml(r.descr||'—')}</td>
              <td>${escapeHtml(r.motivo||'—')}</td>
              <td>${escapeHtml(r.setor||'—')}</td>
              <td style="font-weight:${r.rua?'700':'400'};color:${r.rua?'#0b2647':'#aaa'};">${r.rua?'Rua '+escapeHtml(r.rua):'—'}</td>
              <td style="font-size:10px;">${escapeHtml(r.depto||'—')}</td>
              <td style="text-align:center;font-weight:700;color:#1a4480;">${escapeHtml(r.unidade||'—')}</td>
              <td style="text-align:right;">${fN(r.qtd)}</td>
              <td style="font-weight:700;color:#0b2647;text-align:right;">${fBRL(r.valor)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn btn-outline btn-sm" onclick="relPag(-1)" ${pag<=0?'disabled':''}>◀ Anterior</button>
        <button class="btn btn-outline btn-sm" onclick="relPag(1)"  ${pag>=totalPags-1?'disabled':''}>Próxima ▶</button>
      </div>
    </div>

    </div><!-- /rel-det-wrap -->
  `;

  // Restaura estado do detalhamento
  if(RelState._detAberto){
    const wrap=document.getElementById('rel-det-wrap');
    const icon=document.getElementById('rel-det-icon');
    const lbl=document.getElementById('rel-det-label');
    if(wrap){wrap.style.display='block';}
    if(icon) icon.textContent='▼';
    if(lbl)  lbl.textContent='Ocultar detalhamento';
  }

  // Listeners
  $('#rel-dt-ini')?.addEventListener('change',e=>{ RelState.ini=e.target.value?new Date(e.target.value+'T00:00:00'):null; RelState.paginaTabela=0; renderRelacoes(); });
  $('#rel-dt-fim')?.addEventListener('change',e=>{ RelState.fim=e.target.value?new Date(e.target.value+'T23:59:59'):null; RelState.paginaTabela=0; renderRelacoes(); });
  let _relDebounce;
  $('#rel-busca')?.addEventListener('input',e=>{ clearTimeout(_relDebounce); _relDebounce=setTimeout(()=>{ RelState.busca=e.target.value; RelState.paginaTabela=0; renderRelacoes(); },300); });

  // Gráficos
  setTimeout(()=>{ relRenderCharts(); }, 80);
}

function relExportarPDF(){
  // Garante detalhamento oculto antes de imprimir
  const detWrap = document.getElementById('rel-det-wrap');
  const detAberto = detWrap && detWrap.style.display!=='none';
  if(detAberto) detWrap.style.display='none';

  // Pequeno delay para o DOM atualizar, depois imprime
  setTimeout(()=>{
    window.print();
    // Restaura estado após impressão
    if(detAberto && detWrap) detWrap.style.display='block';
  }, 120);
}

function relToggleDetalhamento(){
  const wrap = document.getElementById('rel-det-wrap');
  const icon  = document.getElementById('rel-det-icon');
  const label = document.getElementById('rel-det-label');
  if(!wrap) return;
  const aberto = wrap.style.display !== 'none';
  wrap.style.display  = aberto ? 'none' : 'block';
  icon.textContent    = aberto ? '▶' : '▼';
  label.textContent   = aberto ? 'Mostrar detalhamento' : 'Ocultar detalhamento';
  RelState._detAberto = !aberto;
}

function capToggleDetalhamento(){
  const wrap  = document.getElementById('cap-det-wrap');
  const icon  = document.getElementById('cap-det-icon');
  const label = document.getElementById('cap-det-label');
  if(!wrap) return;
  const aberto = wrap.style.display !== 'none';
  wrap.style.display = aberto ? 'none' : 'block';
  icon.textContent   = aberto ? '▶' : '▼';
  label.textContent  = aberto ? 'Mostrar Detalhamento' : 'Ocultar Detalhamento';
  CapCDState.detAberto = !aberto;
}

function capToggleSemanal(){
  const wrap  = document.getElementById('cap-sem-wrap');
  const icon  = document.getElementById('cap-sem-icon');
  const label = document.getElementById('cap-sem-label');
  if(!wrap) return;
  const aberto = wrap.style.display !== 'none';
  wrap.style.display = aberto ? 'none' : 'block';
  icon.textContent   = aberto ? '▶' : '▼';
  label.textContent  = aberto ? 'Mostrar tabelas abaixo' : 'Ocultar tabelas abaixo';
  CapCDState.semAberto = !aberto;
}

function relSort(col){
  if(RelState.sortCol===col) RelState.sortDir*=-1;
  else { RelState.sortCol=col; RelState.sortDir=-1; }
  renderRelacoes();
}

function relPag(delta){
  const rows=relRows();
  const totalPags=Math.max(1,Math.ceil(rows.length/RelState.TAM_PAG));
  RelState.paginaTabela=Math.max(0,Math.min(totalPags-1,RelState.paginaTabela+delta));
  renderRelacoes();
}

function relSortLanc(col){
  const s = window._relLancSort || {col:'valor', dir:-1};
  if(s.col===col) s.dir*=-1; else { s.col=col; s.dir=-1; }
  window._relLancSort = s;
  renderRelacoes();
}

function relToggleLanc(numLanc){
  const tr = document.getElementById('rel-lanc-'+numLanc);
  if(!tr) return;

  // Toggle — fecha se aberto
  if(tr.style.display !== 'none'){ tr.style.display='none'; return; }

  // Fecha outros abertos
  document.querySelectorAll('[id^="rel-lanc-"]').forEach(el=>el.style.display='none');

  const fBRL = v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const fN   = v=>Number(v||0).toLocaleString('pt-BR');

  // Pega todos os registros deste lançamento
  const rows = relRows().filter(r=>r.numLanc===numLanc);
  if(!rows.length) return;

  const totalVal = rows.reduce((s,r)=>s+(r.valor||0),0);
  const totalQtd = rows.reduce((s,r)=>s+(r.qtd||0),0);
  const func = rows[0];

  const linhas = rows.map((r,i)=>`
    <tr style="background:${i%2?'#f8fafc':'#fff'};">
      <td style="font-size:10px;color:#7a8798;">${escapeHtml(r.codProd||'—')}</td>
      <td style="font-size:10px;"><strong>${escapeHtml(r.descr||'—')}</strong></td>
      <td style="font-size:10px;text-align:center;">${fN(r.qtd)}</td>
      <td style="font-size:10px;">${escapeHtml(r.motivo||'—')}</td>
      <td style="font-size:10px;">${escapeHtml(r.setor||'—')}</td>
      <td style="font-size:10px;">${r.rua?'Rua '+escapeHtml(r.rua):'—'}</td>
      <td style="font-size:10px;color:#555;">${escapeHtml(r.depto||'—')}</td>
      <td style="font-size:10px;text-align:center;font-weight:700;color:#1a4480;">${escapeHtml(r.unidade||'—')}</td>
      <td style="font-size:10px;font-weight:700;color:#0b2647;text-align:right;white-space:nowrap;">${fBRL(r.valor)}</td>
    </tr>`).join('');

  tr.style.display = '';
  tr.querySelector('td').innerHTML = `
    <div style="padding:10px 14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
        <span style="font-size:11px;font-weight:800;color:#1a4480;">
          🧾 Lanç. <strong>${escapeHtml(numLanc)}</strong>
          &nbsp;·&nbsp; ${escapeHtml(func.nome||'—')}
          &nbsp;·&nbsp; ${func.dt?fmtDateBR(func.dt):'—'}
          &nbsp;·&nbsp; ${rows.length} itens &nbsp;·&nbsp; ${fN(totalQtd)} unidades
          &nbsp;·&nbsp; <span style="color:#1a9c62;font-weight:800;">${fBRL(totalVal)}</span>
        </span>
        <button onclick="document.getElementById('rel-lanc-${escapeHtml(numLanc)}').style.display='none'"
          style="background:none;border:none;color:#7a8798;cursor:pointer;font-size:16px;padding:0 4px;">✕</button>
      </div>
      <div style="overflow-x:auto;max-height:360px;overflow-y:auto;">
        <table class="data-table" style="font-size:10.5px;min-width:700px;">
          <thead><tr>
            <th>Cód. Produto</th><th>Descrição</th><th>Qtd</th>
            <th>Motivo</th><th>Setor</th><th>Rua</th>
            <th>Depto</th><th>Master</th><th>Valor</th>
          </tr></thead>
          <tbody>${linhas}</tbody>
          <tfoot><tr style="background:#0b2647;color:#fff;">
            <td colspan="2" style="padding:4px 6px;font-weight:800;font-size:10px;">TOTAL</td>
            <td style="text-align:center;font-weight:800;">${fN(totalQtd)}</td>
            <td colspan="5"></td>
            <td style="text-align:right;font-weight:800;white-space:nowrap;">${fBRL(totalVal)}</td>
          </tr></tfoot>
        </table>
      </div>
    </div>`;
  tr.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function relDrillDown(campo, chave, label, titulo, colLabel){
  const drillId = `rel-drill-${campo}-${chave}`;
  const tr = document.getElementById(drillId);
  if(!tr) return;

  // Toggle — fecha se já aberto
  if(tr.style.display !== 'none'){
    tr.style.display = 'none';
    return;
  }

  // Fecha todos os outros drills abertos
  document.querySelectorAll('[id^="rel-drill-"]').forEach(el=>el.style.display='none');

  const rows = relRows();
  const fBRL = v=>'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
  const fN   = v=>Number(v||0).toLocaleString('pt-BR');

  // Filtra os registros que pertencem a este item
  const sub = rows.filter(r=> String(r[campo]||'') === String(chave));
  if(!sub.length){ tr.style.display='none'; return; }

  // Agrupa por produto + descrição para mostrar o breakdown
  const prodMap = new Map();
  sub.forEach(r=>{
    const k = (r.codProd||'—') + '::' + (r.descr||'—');
    const ex = prodMap.get(k) || {codProd:r.codProd, descr:r.descr, qtd:0, valor:0, lancamentos:new Set(), motivos:new Set()};
    ex.qtd   += (r.qtd||0);
    ex.valor += (r.valor||0);
    if(r.numLanc) ex.lancamentos.add(r.numLanc);
    if(r.motivo)  ex.motivos.add(r.motivo);
    prodMap.set(k, ex);
  });
  const prods = [...prodMap.values()].sort((a,b)=>b.valor-a.valor);
  const totalVal = sub.reduce((s,r)=>s+(r.valor||0),0);
  const totalQtd = sub.reduce((s,r)=>s+(r.qtd||0),0);

  const linhas = prods.map((p,i)=>{
    const pct = totalVal>0?(p.valor/totalVal*100):0;
    const motStr = [...p.motivos].slice(0,2).join(', ')+(p.motivos.size>2?'…':'');
    return `<tr style="background:${i%2?'#f8fafc':'#fff'};">
      <td style="color:#7a8798;font-size:10px;">${i+1}</td>
      <td style="font-size:10px;color:#7a8798;">${escapeHtml(p.codProd||'—')}</td>
      <td style="font-size:10px;"><strong>${escapeHtml(p.descr||'—')}</strong></td>
      <td style="font-size:10px;text-align:center;">${fN(p.qtd)}</td>
      <td style="font-size:10px;text-align:center;">${p.lancamentos.size}</td>
      <td style="font-size:10px;color:#555;">${escapeHtml(motStr)}</td>
      <td style="font-size:10px;font-weight:700;color:#0b2647;text-align:right;white-space:nowrap;">${fBRL(p.valor)}</td>
      <td style="font-size:9px;">
        <div style="display:flex;align-items:center;gap:4px;">
          <div style="flex:1;background:#dde3ea;border-radius:3px;height:5px;">
            <div style="width:${pct.toFixed(1)}%;background:#1a4480;height:5px;border-radius:3px;"></div>
          </div>
          <span style="color:#7a8798;white-space:nowrap;">${pct.toFixed(1)}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  tr.style.display = '';
  tr.querySelector('td').innerHTML = `
    <div style="padding:10px 12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:11px;font-weight:800;color:#1a4480;">
          🔍 ${escapeHtml(titulo)} → <strong>${escapeHtml(label)}</strong>
          &nbsp;·&nbsp; ${sub.length} registros &nbsp;·&nbsp; ${fBRL(totalVal)} &nbsp;·&nbsp; ${fN(totalQtd)} itens
        </span>
        <button onclick="document.getElementById('${drillId}').style.display='none'"
          style="background:none;border:none;color:#7a8798;cursor:pointer;font-size:16px;padding:0 4px;">✕</button>
      </div>
      <div style="overflow-x:auto;max-height:300px;overflow-y:auto;">
        <table class="data-table" style="font-size:10.5px;min-width:600px;">
          <thead><tr>
            <th>#</th><th>Cód.</th><th>Produto / Descrição</th>
            <th>Qtd</th><th>Lançamentos</th><th>Motivos</th>
            <th>Valor Total</th><th>% do grupo</th>
          </tr></thead>
          <tbody>${linhas}</tbody>
          <tfoot><tr style="background:#0b2647;color:#fff;">
            <td colspan="3" style="font-weight:800;font-size:10px;padding:4px 6px;">TOTAL</td>
            <td style="font-weight:800;text-align:center;">${fN(totalQtd)}</td>
            <td style="font-weight:800;text-align:center;">${new Set(sub.filter(r=>r.numLanc).map(r=>r.numLanc)).size}</td>
            <td></td>
            <td style="font-weight:800;text-align:right;white-space:nowrap;">${fBRL(totalVal)}</td>
            <td></td>
          </tr></tfoot>
        </table>
      </div>
    </div>`;
}

function relRenderCharts(){
  const rows = relRows();
  const rowsAvaria = rows.filter(r=>!r.isRecuperado);
  const rowsRecup  = rows.filter(r=>r.isRecuperado);

  // Detecta granularidade baseada no filtro
  const ini = RelState.ini, fim = RelState.fim;
  const hojeG = new Date();
  let granular = 'dia';
  if(ini && fim){
    const dias = Math.round((fim-ini)/86400000);
    if(dias > 60) granular = 'mes';
    else if(dias > 6) granular = 'semana';
    else granular = 'dia';
  }
  const umDia = ini && fim && Math.round((fim-ini)/86400000)===0;
  // Quando é 1 dia ou mês atual (≤31 dias) → dia a dia
  const ehMesAtual = ini && fim && Math.round((fim-ini)/86400000) <= 31;
  const granEfet = (umDia || ehMesAtual) ? 'dia' : granular;

  // Intervalo efetivo — se 1 dia, mostra o mês todo
  const iniEfet = umDia ? new Date(hojeG.getFullYear(),hojeG.getMonth(),1)
                        : (ini ? new Date(ini.getFullYear(),ini.getMonth(),ini.getDate()) : null);
  const fimEfet = umDia ? new Date(hojeG.getFullYear(),hojeG.getMonth()+1,0)
                        : (fim ? new Date(fim.getFullYear(),fim.getMonth(),fim.getDate()) : null);

  // Helper chave local sem fuso
  const localDateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  // Gera o esqueleto de todos os dias/semanas/meses do intervalo (para não ter lacunas)
  const gerarEixo = (gr, ini0, fim0) => {
    if(!ini0 || !fim0) return null; // sem filtro: usa só os dados
    const keys = [];
    const cur = new Date(ini0.getFullYear(), ini0.getMonth(), ini0.getDate());
    const end = new Date(fim0.getFullYear(), fim0.getMonth(), fim0.getDate());
    if(gr==='dia'){
      while(cur<=end){
        const k = localDateKey(cur);
        const label = `${String(cur.getDate()).padStart(2,'0')}/${MESES_PT[cur.getMonth()]}`;
        keys.push({key:k, label});
        cur.setDate(cur.getDate()+1);
      }
    } else if(gr==='semana'){
      const seen = new Set();
      while(cur<=end){
        const dow=cur.getDay(), diff=dow===0?-6:1-dow;
        const seg=new Date(cur); seg.setDate(cur.getDate()+diff);
        const k=localDateKey(seg);
        if(!seen.has(k)){ seen.add(k); keys.push({key:k, label:'Sem '+String(seg.getDate()).padStart(2,'0')+'/'+MESES_PT[seg.getMonth()]}); }
        cur.setDate(cur.getDate()+7);
      }
    } else {
      const seen = new Set();
      while(cur<=end){
        const k=`${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}`;
        if(!seen.has(k)){ seen.add(k); keys.push({key:k, label:MESES_PT[cur.getMonth()]+'/'+String(cur.getFullYear()).slice(2)}); }
        cur.setMonth(cur.getMonth()+1);
      }
    }
    return keys;
  };

  const agrupar = (arr, gr) => {
    const m = new Map();
    arr.forEach(r=>{
      if(!r.dt) return;
      const dt = r.dt instanceof Date ? r.dt : new Date(r.dt);
      // Comparação por data local, sem hora
      if(iniEfet && new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()) < iniEfet) return;
      if(fimEfet && new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()) > fimEfet) return;
      let key, label;
      if(gr==='mes'){
        key   = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
        label = MESES_PT[dt.getMonth()]+'/'+String(dt.getFullYear()).slice(2);
      } else if(gr==='semana'){
        const dow=dt.getDay(), diff=dow===0?-6:1-dow;
        const seg=new Date(dt); seg.setDate(dt.getDate()+diff);
        key   = localDateKey(seg);
        label = `${String(seg.getDate()).padStart(2,'0')}/${MESES_PT[seg.getMonth()]}`;
      } else {
        key   = localDateKey(dt);
        label = `${String(dt.getDate()).padStart(2,'0')}/${MESES_PT[dt.getMonth()]}`;
      }
      const ex = m.get(key)||{key,label,valor:0};
      ex.valor += (r.valor||0);
      m.set(key,ex);
    });
    return m;
  };

  const mapA = agrupar(rowsAvaria, granEfet);
  const mapR = agrupar(rowsRecup,  granEfet);

  // Usa o eixo gerado ou une os dados existentes
  const eixo = gerarEixo(granEfet, iniEfet, fimEfet)
    || [...new Set([...mapA.keys(),...mapR.keys()])].sort().map(k=>{
        const ex=[...mapA.values(),...mapR.values()].find(s=>s&&s.key===k);
        return {key:k,label:ex?ex.label:k};
      });

  const allKeys   = eixo.map(e=>e.key);
  const allLabels = eixo.map(e=>e.label);

  // Gráfico Avaria vs Recuperação
  const cr = document.getElementById('rel-chart-recup');
  if(cr&&typeof Chart!=='undefined'&&allKeys.length){
    if(cr._chartInstance){cr._chartInstance.destroy();cr._chartInstance=null;}
    cr._chartInstance = new Chart(cr.getContext('2d'),{
      type:'line',
      data:{
        labels: allLabels,
        datasets:[
          { label:'Avaria', data:allKeys.map(k=>mapA.get(k)?.valor||0),
            borderColor:'#d64545', backgroundColor:'#d6454520',
            borderWidth:2.5, tension:0.35, fill:true,
            pointRadius:4, pointBackgroundColor:'#d64545', pointBorderColor:'#fff', pointBorderWidth:2 },
          { label:'Recuperado', data:allKeys.map(k=>mapR.get(k)?.valor||0),
            borderColor:'#1a9c62', backgroundColor:'#1a9c6215',
            borderWidth:2.5, tension:0.35, fill:true,
            pointRadius:4, pointBackgroundColor:'#1a9c62', pointBorderColor:'#fff', pointBorderWidth:2 }
        ]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        layout:{padding:{top:20}},
        plugins:{
          legend:{display:true,position:'bottom',labels:{color:'#123a6b',font:{size:11}}},
          tooltip:{mode:'index',intersect:false,callbacks:{
            label:ctx=>`${ctx.dataset.label}: ${AV_LABEL_BRL(ctx.raw)}`
          }},
          datalabels:{
            anchor:'top', align:'top', offset:4, clamp:true,
            font:{size:9,weight:'700'},
            color:ctx=>ctx.datasetIndex===0?'#d64545':'#1a9c62',
            formatter:v=>v>0?AV_LABEL_BRL(v):''
          }
        },
        scales:{
          x:{ticks:{color:'#7a8798',font:{size:9},maxRotation:45},grid:{color:'#eef1f4'}},
          y:{ticks:{color:'#7a8798',font:{size:9},callback:AV_TICK_Y_BRL},beginAtZero:true,grid:{color:'#eef1f4'}}
        }
      }
    });
  }

  // Gráficos temporais (dia/semana/mês)
  const pct = (arr,i) => {
    if(i===0||!arr[i-1].valor) return null;
    return ((arr[i].valor-arr[i-1].valor)/arr[i-1].valor*100);
  };
  const mkChart=(id,itens)=>{
    const c=document.getElementById(id);
    if(!c||typeof Chart==='undefined'||!itens.length) return;
    if(c._chartInstance){c._chartInstance.destroy();c._chartInstance=null;}
    const valores=itens.map(d=>d.valor);
    c._chartInstance=new Chart(c.getContext('2d'),{
      type:'bar',
      data:{labels:itens.map(d=>d.label),datasets:[{
        label:'Avaria',data:valores,
        backgroundColor:valores.map((v,i)=>{const p=pct(itens,i);return p===null?'#1a4480':p>=0?'#d64545':'#1a9c62';}),
        borderRadius:5,borderSkipped:false}]},
      options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:36}},
        plugins:{legend:{display:false},
          tooltip:{callbacks:{label:ctx=>`R$ ${Number(ctx.raw).toLocaleString('pt-BR',{minimumFractionDigits:2})}`,
            afterLabel:ctx=>{const p=pct(itens,ctx.dataIndex);return p===null?'':`${p>=0?'▲':'▼'} ${Math.abs(p).toFixed(1)}% vs anterior`;}}},
          datalabels:{anchor:'end',align:'top',offset:2,clamp:true,
            color:(ctx)=>{const p=pct(itens,ctx.dataIndex);return p===null?'#1a4480':p>=0?'#d64545':'#1a9c62';},
            font:{size:9,weight:'700'},
            formatter:(v,ctx)=>{const p=pct(itens,ctx.dataIndex);
              return AV_LABEL_BRL(v)+(p!==null?`\n${p>=0?'▲':'▼'}${Math.abs(p).toFixed(1)}%`:'');}}},
        scales:{x:{ticks:{color:'#7a8798',font:{size:9}},grid:{color:'#eef1f4'}},
          y:{ticks:{color:'#7a8798',font:{size:9},callback:AV_TICK_Y_BRL},beginAtZero:true,grid:{color:'#eef1f4'}}}}
    });
  };

  // Agrupa para os 3 gráficos temporais usando rowsAvaria (excl. recuperado)
  const localDK = d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const diaMapT=new Map(),semMapT=new Map(),mesMapT=new Map();
  rowsAvaria.forEach(r=>{
    if(!r.dt) return;
    const dt=r.dt instanceof Date?r.dt:new Date(r.dt);
    const v=r.valor||0;
    const dk=localDK(dt);
    const dLabel=`${String(dt.getDate()).padStart(2,'0')}/${MESES_PT[dt.getMonth()]}`;
    const dEx=diaMapT.get(dk)||{label:dLabel,valor:0}; dEx.valor+=v; diaMapT.set(dk,dEx);
    const dow=dt.getDay(),diff=dow===0?-6:1-dow;
    const seg=new Date(dt); seg.setDate(dt.getDate()+diff);
    const sk=localDK(seg);
    const sEx=semMapT.get(sk)||{label:'Sem '+String(seg.getDate()).padStart(2,'0')+'/'+MESES_PT[seg.getMonth()],valor:0}; sEx.valor+=v; semMapT.set(sk,sEx);
    const mk=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`;
    const mEx=mesMapT.get(mk)||{label:MESES_PT[dt.getMonth()]+'/'+String(dt.getFullYear()).slice(2),valor:0}; mEx.valor+=v; mesMapT.set(mk,mEx);
  });
  mkChart('rel-chart-dia',    [...diaMapT.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([,v])=>v));
  mkChart('rel-chart-semana', [...semMapT.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([,v])=>v));
  mkChart('rel-chart-mes',    [...mesMapT.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([,v])=>v));


}

/* ============================================================
   CAPACIDADE CD — módulo completo
   ============================================================ */

/* Estado da guia */
const CapCDState = {
  mostrarDetalhes: false,   // toggle Sim/Não
  filtroIni: null,          // Date | null — filtro de data início
  filtroFim: null,          // Date | null — filtro de data fim
  filtroAtalho: 'tudo',     // 'mesAtual'|'mesAnt'|'anoAtual'|'anoAnt'|'tudo'
  filtroProdutos: [],       // array de codprod selecionados
  filtroRevenda: 'todos',   // 'todos'|'nao'
  filtroUrgencia: 'maxalta', // filtro urgência transferidos — padrão: Máxima + Alta
  filtroOrigem: 'todos',    // filtro tipo origem transferidos (inteiro|drivein|meio|terco|todos)
  filtroDiffIni: '',        // filtro diferença inicial
  filtroDiffFim: '',        // filtro diferença final
  // — Gerar Demanda —
  demandaNaoValidado: true,       // toggle Não Validado
  demandaCorretivo: true,         // toggle Corretivo Ocorrência (sheet Tipo)
  demandaTransferido: true,       // toggle Transferido Preventivo
  demandaTipoIni: null,           // Date | null — início período sheet Tipo
  demandaTipoFim: null,           // Date | null — fim período sheet Tipo
  demandaGerada: null,            // array | null — lista gerada pelo botão
  // — Intervalo de Ruas / Diluição —
  demandaRuaIni: '',              // número da rua inicial
  demandaRuaFim: '',              // número da rua final
  demandaQtdItens: '',            // qtd total de itens a diluir no intervalo
  demandaRuaPorPagina: true,      // true = 1 rua por página no PDF
  ultValSoUltimoDia: true,        // true = mostra só último dia com dados; false = todas as validações
  rankPage: 0,              // paginação do ranking
  detPage: 0,               // paginação tabela detalhada
  tblPage: 0,               // paginação tabela principal
  entradosPage: 0,          // paginação itens entrados
  saidosPage: 0,            // paginação itens saídos
  demandaPage: 0,           // paginação demanda
  rankPageSize: 15,
  detPageSize: 20,
  tblPageSize: 25,
  entradosPageSize: 10,
  saidosPageSize: 10,
  demandaPageSize: 30,
  semAberto: false,          // toggle Análise Semanal — oculta tabelas abaixo por padrão
  detAberto: false,          // toggle Mostrar Detalhamento — Tabela Detalhada de Validações
  charts: {}                // referências dos Chart.js
};

/* Helpers de data locais */
const capDK = d => {
  if(!d || !(d instanceof Date) || isNaN(d)) return null;
  const y = d.getFullYear(), m = d.getMonth()+1, dd = d.getDate();
  return `${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;
};
const capDateLabel = d => {
  if(!d) return '';
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
};
// Semana ISO-like: usa segunda-feira como início
const capWeekKey = d => {
  const dow = d.getDay(); // 0=dom
  const diff = dow === 0 ? -6 : 1 - dow;
  const seg = new Date(d); seg.setDate(d.getDate() + diff);
  return capDK(seg);
};
const capWeekLabel = d => {
  const dow = d.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  const seg = new Date(d); seg.setDate(d.getDate() + diff);
  const fim = new Date(seg); fim.setDate(seg.getDate() + 6);
  return `${String(seg.getDate()).padStart(2,'0')}/${String(seg.getMonth()+1).padStart(2,'0')} – ${String(fim.getDate()).padStart(2,'0')}/${String(fim.getMonth()+1).padStart(2,'0')}`;
};

/* Aplica atalho de período */
function capSetAtalho(key) {
  const hoje = new Date();
  const y = hoje.getFullYear(), m = hoje.getMonth();
  CapCDState.filtroAtalho = key;
  if (key === 'mesAtual') {
    CapCDState.filtroIni = new Date(y, m, 1, 0, 0, 0);
    CapCDState.filtroFim = new Date(y, m+1, 0, 23, 59, 59);
  } else if (key === 'mesAnt') {
    CapCDState.filtroIni = new Date(y, m-1, 1, 0, 0, 0);
    CapCDState.filtroFim = new Date(y, m, 0, 23, 59, 59);
  } else if (key === 'anoAtual') {
    CapCDState.filtroIni = new Date(y, 0, 1, 0, 0, 0);
    CapCDState.filtroFim = new Date(y, 11, 31, 23, 59, 59);
  } else if (key === 'anoAnt') {
    CapCDState.filtroIni = new Date(y-1, 0, 1, 0, 0, 0);
    CapCDState.filtroFim = new Date(y-1, 11, 31, 23, 59, 59);
  } else { // tudo
    CapCDState.filtroIni = null;
    CapCDState.filtroFim = null;
  }
  CapCDState.detPage = 0;
  renderCapacidadeCD();
}

/* Último dia útil disponível na sheet Tipo antes ou igual a uma data */
function capUltimoDiaUtilTipo(sheetTipo, refDate) {
  if (!sheetTipo || !sheetTipo.length) return null;
  const isUtil = d => d && d.getDay && d.getDay() >= 1 && d.getDay() <= 5;
  const datasDisponiveis = [...new Set(
    sheetTipo.filter(r => r.dt && isUtil(r.dt))
             .map(r => capDK(r.dt))
             .filter(Boolean)
  )].sort();
  if (!datasDisponiveis.length) return null;
  const refDK = capDK(refDate);
  const candidatas = datasDisponiveis.filter(dk => dk <= refDK);
  return candidatas.length ? candidatas[candidatas.length-1] : datasDisponiveis[datasDisponiveis.length-1];
}

/* Dias úteis entre duas datas (seg-sex, inclusive) */
function capDiasUteisEntre(d1, d2) {
  if (!d1 || !d2) return 0;
  let count = 0;
  const cur = new Date(d1); cur.setHours(0,0,0,0);
  const end = new Date(d2); end.setHours(0,0,0,0);
  while (cur <= end) {
    const dow = cur.getDay();
    if (dow >= 1 && dow <= 5) count++;
    cur.setDate(cur.getDate()+1);
  }
  return count;
}

/* Dias úteis DESDE uma data até hoje (exclusive a própria data) */
function capDiasDesde(ultimaDt) {
  if (!ultimaDt) return null;
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const d = new Date(ultimaDt); d.setHours(0,0,0,0);
  if (d >= hoje) return 0;
  return capDiasUteisEntre(new Date(d.getTime()+86400000), hoje);
}

/* Gera a lista de demanda unificada */
function capGerarDemanda(processed, comp) {
  const novaMap = new Map((processed.p8022Nova||[]).map(r=>[r.codprod,r]));
  const revendaExcluir = CapCDState.filtroRevenda === 'nao';
  const revendaSetExcl = revendaExcluir
    ? new Set((processed.p8022Nova||[]).filter(r=>r.revenda==='SIM').map(r=>r.codprod))
    : new Set();

  const demandaMap = new Map();

  const addDemanda = (codprod, descricao, origem, extra={}) => {
    if (revendaExcluir && revendaSetExcl.has(codprod)) return;
    const nova = novaMap.get(codprod);
    const rua   = (nova ? nova.rua    || '' : '') || extra.rua    || '';
    const predio= (nova ? nova.predio || '' : '') || extra.predio || '';
    const apto  = (nova ? nova.apto   || '' : '') || extra.apto   || '';
    const desc  = (nova ? nova.descricao || '' : '') || descricao || '';
    if (!codprod) return;
    if (!demandaMap.has(codprod)) {
      demandaMap.set(codprod, { codprod, descricao: desc, rua, predio, apto, origens: new Set(), revalidacao: false, contTipo: 0 });
    }
    const entry = demandaMap.get(codprod);
    entry.origens.add(origem);
    if (extra.revalidacao) entry.revalidacao = true;
    if (extra.contTipo) entry.contTipo = Math.max(entry.contTipo, extra.contTipo);
  };

  // 1 — Não Validados
  if (CapCDState.demandaNaoValidado) {
    const validadosSet = comp.uniqueValidadosPorCod;
    const rows8022N = comp.rows8022N || [];
    const elegiveisSet = new Set((comp.rows8022||[]).map(r=>r.codprod));
    // Produtos em 8022 Nova não validados
    rows8022N.forEach(r => {
      if (!validadosSet.has(r.codprod)) {
        addDemanda(r.codprod, r.descricao, 'Não Validado');
      }
    });
    // Produtos elegíveis (8022 NIVEL=1) não validados e não em 8022 Nova
    const nova8022Set = new Set(rows8022N.map(r=>r.codprod));
    (comp.rows8022||[]).forEach(r => {
      if (!validadosSet.has(r.codprod) && !nova8022Set.has(r.codprod)) {
        addDemanda(r.codprod, r.descricao, 'Não Validado', {rua:r.rua||'',predio:r.predio||'',apto:r.apto||''});
      }
    });
  }

  // 2 — Corretivo Ocorrência (sheet Tipo)
  if (CapCDState.demandaCorretivo && processed.sheetTipo) {
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    let tipoIni = CapCDState.demandaTipoIni;
    let tipoFim = CapCDState.demandaTipoFim;
    if (!tipoIni && !tipoFim) {
      const ultimoDK = capUltimoDiaUtilTipo(processed.sheetTipo, hoje);
      if (ultimoDK) {
        const [y,m,d] = ultimoDK.split('-');
        tipoIni = new Date(+y,+m-1,+d);
        tipoFim = new Date(+y,+m-1,+d,23,59,59);
      }
    }
    const tipoFiltrado = (processed.sheetTipo||[]).filter(r => {
      if (!r.dt) return false;
      if (tipoIni && r.dt < tipoIni) return false;
      if (tipoFim && r.dt > tipoFim) return false;
      return true;
    });
    const tipoMap = new Map();
    tipoFiltrado.forEach(r => {
      if (!tipoMap.has(r.codprod)) tipoMap.set(r.codprod, { datas: new Set() });
      tipoMap.get(r.codprod).datas.add(capDK(r.dt));
    });
    tipoMap.forEach((v, codprod) => {
      const nova = novaMap.get(codprod);
      const desc = nova ? nova.descricao || '' : '';
      addDemanda(codprod, desc, 'Corretivo Ocorrência', { revalidacao: v.datas.size > 1, contTipo: v.datas.size });
    });
  }

  // 3 — Transferido Preventivo (urgência ≠ Normal)
  if (CapCDState.demandaTransferido) {
    (comp.itensTransferidos||[]).filter(r => r.urgencia !== 'Normal').forEach(r => {
      addDemanda(r.codprod, r.descricao, 'Transferido Preventivo');
    });
  }

  // Converte e ordena RUA → PREDIO → APTO
  let lista = [...demandaMap.values()];
  lista.sort((a,b) => {
    const rv = (a.rua||'').localeCompare(b.rua||'', undefined, {numeric:true});
    if (rv) return rv;
    const pv = (a.predio||'').localeCompare(b.predio||'', undefined, {numeric:true});
    if (pv) return pv;
    return (a.apto||'').localeCompare(b.apto||'', undefined, {numeric:true});
  });

  // — Filtro por intervalo de ruas —
  const ruaIniNum = parseInt(CapCDState.demandaRuaIni, 10);
  const ruaFimNum = parseInt(CapCDState.demandaRuaFim, 10);
  const qtdItens  = parseInt(CapCDState.demandaQtdItens, 10);

  const temIntervalo = !isNaN(ruaIniNum) && !isNaN(ruaFimNum) && ruaIniNum <= ruaFimNum;
  if (temIntervalo) {
    lista = lista.filter(r => {
      const n = parseInt(r.rua, 10);
      return !isNaN(n) && n >= ruaIniNum && n <= ruaFimNum;
    });
  }

  // — Diluição de quantidade por rua —
  if (temIntervalo && !isNaN(qtdItens) && qtdItens > 0) {
    const numRuas = ruaFimNum - ruaIniNum + 1;
    const porRua  = Math.floor(qtdItens / numRuas);
    const sobra   = qtdItens - porRua * numRuas; // resto vai para última rua

    // Agrupa por rua
    const porRuaMap = new Map();
    lista.forEach(r => {
      const k = String(parseInt(r.rua, 10));
      if (!porRuaMap.has(k)) porRuaMap.set(k, []);
      porRuaMap.get(k).push(r);
    });

    const resultado = [];
    let ruaIdx = 0;
    for (let rn = ruaIniNum; rn <= ruaFimNum; rn++) {
      const k = String(rn);
      const itens = porRuaMap.get(k) || [];
      const cota  = porRua + (ruaIdx === numRuas - 1 ? sobra : 0);
      resultado.push(...itens.slice(0, cota));
      ruaIdx++;
    }
    lista = resultado;
  }

  return lista;
}

/* ---- Combobox Produto/Código ---- */
function capComboOpen() {
  const list = document.getElementById('cap-combo-list');
  const inp  = document.getElementById('cap-prod-search');
  if (!list) return;
  list.style.display = 'block';
  if (inp) inp.value = '';
  capComboFilter('');
  // Fechar ao clicar fora
  setTimeout(() => {
    const outsideClick = e => {
      const wrap = document.getElementById('cap-combo-wrap');
      if (wrap && !wrap.contains(e.target)) {
        capComboClose();
        document.removeEventListener('mousedown', outsideClick);
      }
    };
    document.addEventListener('mousedown', outsideClick);
  }, 10);
}
function capComboClose() {
  const list = document.getElementById('cap-combo-list');
  const inp  = document.getElementById('cap-prod-search');
  if (list) list.style.display = 'none';
  if (inp) inp.value = CapCDState.filtroProdutos.length > 0 ? CapCDState.filtroProdutos.length + ' selecionado(s)' : '';
  inp && (inp.placeholder = CapCDState.filtroProdutos.length > 0 ? CapCDState.filtroProdutos.length + ' selecionado(s)' : 'Buscar código ou nome...');
}
function capComboFilter(txt) {
  const list = document.getElementById('cap-combo-list');
  if (!list) return;
  const q = txt.toLowerCase();
  [...list.querySelectorAll('div[data-val]')].forEach(el => {
    const v = el.dataset.val;
    if (!v) { el.style.display = ''; return; } // linha "Todos"
    el.style.display = (el.textContent.toLowerCase().includes(q)) ? '' : 'none';
  });
}
function capComboToggle(el) {
  const val = el.dataset.val;
  if (!val) {
    // "Todos"
    CapCDState.filtroProdutos = [];
  } else {
    const idx = CapCDState.filtroProdutos.indexOf(val);
    if (idx >= 0) CapCDState.filtroProdutos.splice(idx, 1);
    else CapCDState.filtroProdutos.push(val);
  }
  CapCDState.detPage = 0; CapCDState.tblPage = 0;
  renderCapacidadeCD();
  // Re-abre e restaura o foco/filtro
  setTimeout(() => {
    capComboOpen();
    const inp = document.getElementById('cap-prod-search');
    if (inp) { capComboFilter(''); }
  }, 30);
}

/* ---- Copiar códigos da demanda ---- */
function capCopiarCodigos() {
  const lista = CapCDState.demandaGerada;
  if (!lista || !lista.length) return alert('Gere a demanda primeiro.');
  const txt = lista.map(r => r.codprod).join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => {
      const btn = document.querySelector('button[onclick="capCopiarCodigos();"]');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ Copiados!';
        btn.style.background = '#e6f9f0';
        btn.style.color = '#1a9c62';
        btn.style.borderColor = '#1a9c62';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background=''; btn.style.color=''; btn.style.borderColor=''; }, 1800);
      }
    }).catch(() => capCopiarFallback(txt));
  } else {
    capCopiarFallback(txt);
  }
}
function capCopiarFallback(txt) {
  const ta = document.createElement('textarea');
  ta.value = txt;
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
  alert(`${txt.split('\n').length} códigos copiados!`);
}

/* ---- Gerar Demanda Action ---- */
function capGerarDemandaAction() {
  const proc = window.APP_STATE && window.APP_STATE.processed;
  if (!proc) return;
  const comp = capCompute(proc);
  CapCDState.demandaGerada = capGerarDemanda(proc, comp);
  CapCDState.demandaPage = 0;
  renderCapacidadeCD();
}

/* ---- Ver Regras Modal ---- */
function capVerRegras() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:28px 32px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.25);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
        <h3 style="margin:0;font-size:16px;color:#1a2e44;">Regras — Gerar Demanda</h3>
        <button onclick="this.closest('div[style*=fixed]').remove();" style="border:none;background:none;font-size:20px;cursor:pointer;color:#7a8798;">✕</button>
      </div>
      <div style="font-size:13px;color:#3a4a5c;line-height:1.7;">
        <p><strong>Não Validado</strong>: produtos presentes na planilha <em>8022 Nova</em> (ou elegíveis em 8022 nível 1) que ainda não possuem registro de validação no período filtrado.</p>
        <p><strong>Corretivo Ocorrência</strong>: produtos com ocorrência registrada na sheet <em>Tipo</em> no período selecionado. Quando um produto aparece em mais de um dia de ocorrência, recebe o badge <span style="background:#1a9c62;color:#fff;border-radius:4px;padding:1px 6px;font-size:11px;">REVALIDAÇÃO</span>.</p>
        <p><strong>Transferido Preventivo</strong>: itens transferidos com urgência diferente de <em>Normal</em>. O endereço utilizado é sempre o da planilha <em>8022 Nova</em>.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:14px 0;">
        <p><strong>Deduplicação</strong>: se um produto aparecer em mais de uma origem, ele é listado uma única vez com todas as origens indicadas.</p>
        <p><strong>Ordenação</strong>: a demanda é ordenada por RUA → PRÉDIO → APTO (ordem alfanumérica).</p>
        <p><strong>PDF 100×100mm</strong>: contém CODPROD, DESCRIÇÃO, RUA, PRÉDIO, APTO (endereço da 8022 Nova), e campos em branco CAP.ANT e CAP.NOVA para preenchimento manual.</p>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

/* ---- Preview PDF Modal ---- */
function capDemandaPreviewPDF() {
  const lista = CapCDState.demandaGerada;
  if (!lista || !lista.length) return alert('Gere a demanda primeiro.');
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);';
  const ruaAtual = { v: null };
  const linhas = lista.map(r => {
    const sep = (r.rua||'') !== ruaAtual.v ? `<tr style="background:#1a4480;"><td colspan="7" style="color:#fff;font-weight:700;font-size:11px;padding:4px 6px;">📍 RUA ${r.rua||'—'}</td></tr>` : '';
    ruaAtual.v = r.rua||'';
    return sep + `<tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:3px 5px;font-size:10px;">${r.codprod||''}</td>
      <td style="padding:3px 5px;font-size:10px;max-width:160px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${r.descricao||''}</td>
      <td style="padding:3px 5px;font-size:10px;">${r.rua||''}</td>
      <td style="padding:3px 5px;font-size:10px;">${r.predio||''}</td>
      <td style="padding:3px 5px;font-size:10px;">${r.apto||''}</td>
      <td style="padding:3px 5px;font-size:10px;"></td>
      <td style="padding:3px 5px;font-size:10px;"></td>
    </tr>`;
  }).join('');
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;max-width:700px;width:95%;max-height:85vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h3 style="margin:0;font-size:15px;color:#1a2e44;">Preview Demanda — ${lista.length} produtos</h3>
        <div style="display:flex;gap:8px;">
          <button onclick="capDemandaExportPDF();" style="padding:6px 14px;border-radius:6px;border:none;background:#e07b00;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Gerar PDF</button>
          <button onclick="this.closest('div[style*=fixed]').remove();" style="border:none;background:none;font-size:20px;cursor:pointer;color:#7a8798;">✕</button>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-family:monospace;">
        <thead><tr style="background:#f0f4f8;">
          <th style="padding:4px 5px;font-size:10px;text-align:left;">CODPROD</th>
          <th style="padding:4px 5px;font-size:10px;text-align:left;">DESCRIÇÃO</th>
          <th style="padding:4px 5px;font-size:10px;text-align:left;">RUA</th>
          <th style="padding:4px 5px;font-size:10px;text-align:left;">PRÉDIO</th>
          <th style="padding:4px 5px;font-size:10px;text-align:left;">APTO</th>
          <th style="padding:4px 5px;font-size:10px;text-align:left;">CAP.ANT</th>
          <th style="padding:4px 5px;font-size:10px;text-align:left;">CAP.NOVA</th>
        </tr></thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

/* ---- Export PDF — cartões 100×100mm ---- */
function capDemandaExportPDF() {
  const lista = CapCDState.demandaGerada;
  if (!lista || !lista.length) return alert('Gere a demanda primeiro.');
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    alert('Biblioteca jsPDF não disponível.');
    return;
  }
  const { jsPDF } = window.jspdf;

  const ruaPorPag = CapCDState.demandaRuaPorPagina;

  // Dimensões do cartão: 100×100mm
  const CW = 100, CH = 100;

  // Agrupar itens por RUA (mantém ordem RUA→PREDIO→APTO já vinda da lista)
  const ruaGroups = new Map();
  lista.forEach(r => {
    const k = r.rua || '(sem rua)';
    if (!ruaGroups.has(k)) ruaGroups.set(k, []);
    ruaGroups.get(k).push(r);
  });
  const ruasUniq = [...ruaGroups.keys()];

  // Cabeçalho de uma página de cartão
  // Cada "página" do PDF = um cartão 100×100
  // Colunas do cartão (dentro do espaço disponível)
  // Layout: cabeçalho azul (12mm) + separador de RUA se modo contínuo (6mm) + linhas de campo

  const now = new Date();
  const dataStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

  // Colunas da tabela dentro do cartão
  // Total largura útil = 96 (2mm margem cada lado)
  const ML = 2, MR = 2, MT = 14; // topo reservado para cabeçalho
  const cols = [
    { label:'CODPROD', w:22 },
    { label:'DESCRIÇÃO', w:38 },
    { label:'PRÉ.', w:10 },
    { label:'APT.', w:10 },
    { label:'C.ANT', w:8 },
    { label:'C.NOV', w:8 },
  ];
  let cx = ML;
  cols.forEach(c => { c.x = cx; cx += c.w; });

  const ROW_H   = 7;    // altura de cada linha de item
  const TBL_HDR = 5;    // altura cabeçalho de colunas
  const RUA_HDR = 6;    // altura separador de rua (modo contínuo)
  const FOOTER_H = 5;
  const MAX_Y   = CH - FOOTER_H;

  // ---- Helpers ----
  function drawCardHeader(rua) {
    // Fundo azul escuro no topo
    doc.setFillColor(26, 46, 68);
    doc.rect(0, 0, CW, 13, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('DEMANDA REPOSIÇÃO', CW / 2, 5.5, { align:'center' });
    doc.setFontSize(8.5);
    if (rua) doc.text(`RUA ${rua}`, ML, 11);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(dataStr, CW - MR, 11, { align:'right' });
  }

  function drawColHeaders(y) {
    doc.setFillColor(210, 220, 232);
    doc.rect(ML, y, CW - ML - MR, TBL_HDR, 'F');
    doc.setTextColor(26, 46, 68);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    cols.forEach(c => doc.text(c.label, c.x + 1, y + 3.5));
    doc.setDrawColor(160, 170, 185);
    doc.line(ML, y + TBL_HDR, CW - MR, y + TBL_HDR);
  }

  function drawRuaBar(rua, y) {
    doc.setFillColor(168, 200, 255); // COR_PREV #A8C8FF
    doc.rect(ML, y, CW - ML - MR, RUA_HDR - 1, 'F');
    doc.setTextColor(26, 46, 68);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`RUA ${rua}`, ML + 2, y + 4);
    doc.setDrawColor(100, 160, 140);
    doc.line(ML, y + RUA_HDR - 1, CW - MR, y + RUA_HDR - 1);
  }

  function drawRow(r, y, shade) {
    if (shade) {
      doc.setFillColor(245, 249, 253);
      doc.rect(ML, y, CW - ML - MR, ROW_H, 'F');
    }
    const ty = y + 4.8;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 32, 48);

    const origemStr = r.origens instanceof Set ? [...r.origens].join('/') : (r.origens||'');
    // Abreviação de origem para caber
    const origemAbr = origemStr.replace('Não Validado','NV').replace('Corretivo Ocorrência','CO').replace('Transferido Preventivo','TP');

    const vals = [
      r.codprod || '',
      r.descricao || '',
      r.predio || '',
      r.apto || '',
      '',   // CAP.ANT
      '',   // CAP.NOVA
    ];

    cols.forEach((c, i) => {
      let txt = String(vals[i]);
      const maxCh = Math.max(2, Math.floor(c.w / 1.7));
      if (txt.length > maxCh) txt = txt.substring(0, maxCh - 1) + '…';
      doc.text(txt, c.x + 1, ty);
    });

    // Badge REVALIDAÇÃO
    if (r.revalidacao) {
      doc.setFillColor(26, 156, 98);
      doc.roundedRect(CW - MR - 16, y + 1, 14, 3.5, 0.8, 0.8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(4.5);
      doc.setFont('helvetica', 'bold');
      doc.text('REVAL.', CW - MR - 9, y + 3.5, { align:'center' });
    }

    // Origem em cinza no canto se não for NV simples
    if (origemAbr && origemAbr !== 'NV') {
      doc.setTextColor(26, 156, 98);
      doc.setFontSize(4.5);
      doc.setFont('helvetica', 'bold');
      doc.text(origemAbr, CW - MR - 1, ty, { align:'right' });
    }

    // Linha divisória
    doc.setDrawColor(220, 228, 236);
    doc.line(ML, y + ROW_H, CW - MR, y + ROW_H);
  }

  function drawFooter(pageNum, total) {
    doc.setTextColor(160, 170, 180);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${pageNum} / ${total}`, CW / 2, CH - 1.5, { align:'center' });
  }

  // ---- Criação do documento ----
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:[CW, CH] });

  let firstPage = true;
  let globalPage = 1;

  function newPage() {
    if (!firstPage) { doc.addPage([CW, CH]); globalPage++; }
    firstPage = false;
  }

  if (ruaPorPag) {
    // ---- MODO: 1 RUA POR PÁGINA ----
    // Cada RUA começa numa página nova. Se os itens não cabem, continua em nova página
    // com cabeçalho repetido.
    ruasUniq.forEach(rua => {
      const items = ruaGroups.get(rua);
      let itemIdx = 0;
      let primeiraDestaRua = true;

      while (itemIdx < items.length) {
        newPage();

        const ruaLabel = primeiraDestaRua ? rua : `${rua} (cont.)`;
        drawCardHeader(ruaLabel);
        drawColHeaders(MT);
        primeiraDestaRua = false;

        let y = MT + TBL_HDR;
        let rowNum = 0;
        while (itemIdx < items.length && y + ROW_H <= MAX_Y) {
          drawRow(items[itemIdx++], y, rowNum % 2 === 1);
          y += ROW_H;
          rowNum++;
        }
      }
    });

  } else {
    // ---- MODO: TUDO EM SEQUÊNCIA ----
    // Página única corrida; a cada nova RUA insere um separador colorido.
    // Se não cabe na página atual, nova página com cabeçalho genérico.
    let y = MT + TBL_HDR;
    let currentPage = false;

    function ensurePage(needed) {
      if (!currentPage || y + needed > MAX_Y) {
        newPage();
        drawCardHeader(null); // sem rua no topo — genérico
        drawColHeaders(MT);
        y = MT + TBL_HDR;
        currentPage = true;
      }
    }

    ruasUniq.forEach(rua => {
      const items = ruaGroups.get(rua);

      // Separador de rua — tenta encaixar na página atual, senão começa nova
      if (!currentPage || y + RUA_HDR + ROW_H > MAX_Y) {
        ensurePage(RUA_HDR + ROW_H);
      }
      // Garantir que o separador caiba
      if (y + RUA_HDR > MAX_Y) { ensurePage(RUA_HDR); }
      drawRuaBar(rua, y);
      y += RUA_HDR;

      let rowNum = 0;
      items.forEach(r => {
        if (y + ROW_H > MAX_Y) {
          newPage();
          drawCardHeader(null);
          drawColHeaders(MT);
          y = MT + TBL_HDR;
          // Repetir separador de rua na continuação
          drawRuaBar(`${rua} (cont.)`, y);
          y += RUA_HDR;
          rowNum = 0;
        }
        drawRow(r, y, rowNum % 2 === 1);
        y += ROW_H;
        rowNum++;
      });
    });
  }

  const totalPg = globalPage;
  for (let p = 1; p <= totalPg; p++) {
    doc.setPage(p);
    drawFooter(p, totalPg);
  }

  doc.save('demanda-reposicao.pdf');
}

/* Destroi charts anteriores */
function capDestroyCharts() {
  Object.values(CapCDState.charts).forEach(c => { try { c.destroy(); } catch(e){} });
  CapCDState.charts = {};
}

/* Compute principal — chama 1× por renderização */
function capCompute(processed) {
  // — Filtro REVENDA —
  const revendaExcluir = CapCDState.filtroRevenda === 'nao';
  const revendaSetExcl = revendaExcluir
    ? new Set((processed.p8022Nova || []).filter(r => r.revenda === 'SIM').map(r => r.codprod))
    : new Set();

  const rows8022   = revendaExcluir
    ? (processed.p8022CDRows || []).filter(r => !revendaSetExcl.has(r.codprod))
    : (processed.p8022CDRows || []);      // NIVEL=1 já filtrado
  const rows8022N  = revendaExcluir
    ? (processed.p8022Nova || []).filter(r => r.revenda !== 'SIM')
    : (processed.p8022Nova || []);        // snapshot atualizado
  const rawCR      = processed.capacidadeRealizada || []; // todas ocorrências

  // — Filtra por período se definido —
  const {filtroIni, filtroFim} = CapCDState;
  const filtroProdSet = CapCDState.filtroProdutos.length > 0 ? new Set(CapCDState.filtroProdutos) : null;
  const cr = rawCR.filter(r => {
    if(!r.dt) return false;
    if(filtroIni && r.dt < filtroIni) return false;
    if(filtroFim && r.dt > filtroFim) return false;
    if(revendaExcluir && revendaSetExcl.has(r.cod)) return false;
    if(filtroProdSet && !filtroProdSet.has(r.cod)) return false;
    return true;
  });

  // — Estoque elegível (NIVEL=1, únicos) —
  const elegiveisSet = new Set(rows8022.map(r => r.codprod));
  const totalElegiveis = elegiveisSet.size;

  // — Validações: NÃO deduplicar — cada ocorrência conta —
  // — porém só conta para COBERTURA produtos que existem em 8022 NIVEL=1 —
  const validacoesAll = cr; // todas (sem filtro de elegibilidade para produtividade)
  const validacoesElegiveis = cr.filter(r => elegiveisSet.has(r.cod));

  // Produtos únicos validados (para cobertura)
  const uniqueValidados = new Set(validacoesElegiveis.map(r => r.cod));
  const totalUnicoValidados = uniqueValidados.size;

  // — Itens Entrados/Saídos são calculados aqui para ajustar pendentes —
  // (cálculo completo feito mais abaixo, após novaMap)
  const _set8022Early = new Set(rows8022.map(r => r.codprod));
  const _set8022NovaEarly = new Set(rows8022N.map(r => r.codprod));
  // Saídos = em 8022 mas não em 8022 Nova — não precisam ser validados
  const _saidosSet = processed.p8022NovaDispo
    ? new Set(rows8022.filter(r => !_set8022NovaEarly.has(r.codprod)).map(r => r.codprod))
    : new Set();
  // Entrados = em 8022 Nova mas não em 8022 — devem ser contabilizados como pendentes
  const _entradosCount = processed.p8022NovaDispo
    ? rows8022N.filter(r => !_set8022Early.has(r.codprod)).length
    : 0;
  // Pendentes efetivos: elegíveis não validados (excl. saídos) + entrados não validados
  const pendentesBase = [...elegiveisSet].filter(cod => !uniqueValidados.has(cod) && !_saidosSet.has(cod)).length;
  const pendentes = pendentesBase + _entradosCount;

  const cobertura = totalElegiveis > 0 ? totalUnicoValidados / totalElegiveis * 100 : 0;

  // — Produtividade (total de ocorrências, sem dedup) —
  const totalValidacoes  = cr.length;
  const totalPreventivo  = cr.filter(r => r.tipo === 'PREVENTIVO').length;
  const totalCorretivo   = cr.filter(r => r.tipo === 'CORRETIVO').length;

  // — Recorrência —
  // Para cada produto elegível, contar quantas vezes aparece
  const prodContagem = new Map(); // codprod → {total, prev, corr, datas}
  validacoesElegiveis.forEach(r => {
    if(!prodContagem.has(r.cod)) prodContagem.set(r.cod, {total:0, prev:0, corr:0, datas:[]});
    const e = prodContagem.get(r.cod);
    e.total++;
    if(r.tipo==='PREVENTIVO') e.prev++; else e.corr++;
    if(r.dt) e.datas.push(r.dt);
  });

  const prodsRecorrencia = [...prodContagem.values()].filter(e => e.total > 1).length;
  const pctRecorrencia = totalUnicoValidados > 0 ? prodsRecorrencia / totalUnicoValidados * 100 : 0;
  const revalidacoes = totalValidacoes - totalUnicoValidados;

  // — Gráfico diário — todas as ocorrências (não só elegíveis)
  const diaMap = new Map();
  cr.forEach(r => {
    if(!r.dt) return;
    const dk = capDK(r.dt);
    if(!dk) return;
    if(!diaMap.has(dk)) diaMap.set(dk, {label: capDateLabel(r.dt), prev:0, corr:0});
    const e = diaMap.get(dk);
    if(r.tipo==='PREVENTIVO') e.prev++; else e.corr++;
  });
  const diasOrdenados = [...diaMap.entries()].sort((a,b)=>a[0].localeCompare(b[0]));

  // — Análise semanal —
  const semMap = new Map();
  validacoesElegiveis.forEach(r => {
    if(!r.dt) return;
    const wk = capWeekKey(r.dt);
    if(!wk) return;
    if(!semMap.has(wk)) semMap.set(wk, {
      label: capWeekLabel(r.dt),
      unicos: new Set(),
      total: 0, prev:0, corr:0,
      diasComValidacao: new Set()
    });
    const e = semMap.get(wk);
    e.unicos.add(r.cod);
    e.total++;
    if(r.tipo==='PREVENTIVO') e.prev++; else e.corr++;
    const dk = capDK(r.dt);
    if(dk) e.diasComValidacao.add(dk);
  });
  const semanasOrdenadas = [...semMap.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([wk, e])=>({
    semana: e.label,
    unicos: e.unicos.size,
    total: e.total,
    prev: e.prev,
    corr: e.corr,
    revalidacoes: e.total - e.unicos.size,
    pendentes: totalElegiveis - e.unicos.size,
    cobertura: totalElegiveis > 0 ? e.unicos.size / totalElegiveis * 100 : 0,
    mediaDiaria: e.diasComValidacao.size > 0 ? e.unicos.size / e.diasComValidacao.size : 0
  }));

  // — Previsão —
  const diasComValidacao = new Set(validacoesElegiveis.filter(r=>r.dt).map(r=>capDK(r.dt)).filter(Boolean));
  const mediaDiariaUnicos = diasComValidacao.size > 0 ? totalUnicoValidados / diasComValidacao.size : 0;
  const previsaoDias = mediaDiariaUnicos > 0 ? Math.ceil(pendentes / mediaDiariaUnicos) : null;

  // — Comparação 8022 × 8022 Nova —
  const novaMap = new Map(rows8022N.map(r => [r.codprod, r]));
  const orig8022Map = new Map(rows8022.map(r => [r.codprod, r]));
  let ajustePos=0, ajusteNeg=0, nenhumAjuste=0;
  const ajustesDetalhes = []; // para tabela validações
  rows8022.forEach(row => {
    if(!uniqueValidados.has(row.codprod)) return; // só validados
    const nova = novaMap.get(row.codprod);
    const capIni  = row.capacidade;
    const capAtual = nova ? nova.capacidade : null;
    let diff = null, status = 'N/D';
    if(capIni !== null && capAtual !== null) {
      diff = capAtual - capIni;
      if(diff > 0)      { status = 'Ajuste Positivo';  ajustePos++; }
      else if(diff < 0) { status = 'Ajuste Negativo';  ajusteNeg++; }
      else              { status = 'Nenhum Ajuste';     nenhumAjuste++; }
    } else {
      status = processed.p8022NovaDispo ? 'Sem Correspondência' : 'N/D';
    }
    ajustesDetalhes.push({ codprod: row.codprod, descricao: row.descricao, capIni, capAtual, diff, status, rua: row.rua, predio: row.predio, apto: row.apto });
  });

  // — Itens Entrados (presentes em 8022 Nova mas NÃO em 8022) —
  const set8022 = new Set(rows8022.map(r => r.codprod));
  const set8022Nova = new Set(rows8022N.map(r => r.codprod));
  const itensEntrados = processed.p8022NovaDispo ? rows8022N.filter(r => !set8022.has(r.codprod)).map(r => ({
    codprod: r.codprod, descricao: r.descricao || '', capacidade: r.capacidade,
    rua: r.rua || '', predio: r.predio || '', apto: r.apto || '', codendereco: r.codendereco || '', pk_end: r.pk_end || ''
  })) : [];

  // — Itens Saídos (presentes em 8022 mas NÃO em 8022 Nova) —
  const itensSaidos = processed.p8022NovaDispo ? rows8022.filter(r => !set8022Nova.has(r.codprod)).map(r => ({
    codprod: r.codprod, descricao: r.descricao || '', capacidade: r.capacidade,
    rua: r.rua || '', predio: r.predio || '', apto: r.apto || '', codendereco: r.codendereco || '', pk_end: r.pk_end || ''
  })) : [];

  // — Itens Transferidos (CODENDERECO diferente entre 8022 e 8022 Nova) —
  const PK_END_INTEIRO_TYPES = new Set(['1-INTEIRO (1,9)', '1-INTEIRO(1,9)', '1-INTEIRO']);
  // Hierarquia de espaço dos tipos de endereço (rank menor = mais espaço)
  const capPkRank = pk => {
    const s = String(pk||'').trim();
    if (s.startsWith('1')) return 1; // 1-INTEIRO (maior)
    if (s.startsWith('2')) return 2; // 2-DRIVE-IN
    if (s.startsWith('8')) return 3; // 8-MEIO
    if (s.startsWith('9')) return 4; // 9-TERCO (menor)
    return 0; // desconhecido
  };
  const capPkLabel = pk => {
    const s = String(pk||'').trim();
    if (s.startsWith('1')) return '1-INTEIRO';
    if (s.startsWith('2')) return '2-DRIVE-IN';
    if (s.startsWith('8')) return '8-MEIO';
    if (s.startsWith('9')) return '9-TERCO';
    return pk || '—';
  };

  const itensTransferidos = processed.p8022NovaDispo ? rows8022N.filter(r => {
    const orig = orig8022Map.get(r.codprod);
    if(!orig) return false;
    const endOrig = (orig.codendereco||'').trim();
    const endNova = (r.codendereco||'').trim();
    return endOrig && endNova && endOrig !== endNova;
  }).map(r => {
    const orig = orig8022Map.get(r.codprod);
    const capIni = orig ? orig.capacidade : null;
    const capNova = r.capacidade;
    const diff = (capIni !== null && capNova !== null) ? capNova - capIni : null;
    const pkOrig = (orig ? orig.pk_end || '' : '').trim();
    const pkNova = (r.pk_end || '').trim();
    const pkMudou = pkOrig !== pkNova;
    const ruaOrig  = orig ? orig.rua    || '' : '';
    const ruaNova  = r.rua    || '';
    const mesmaRua = ruaOrig && ruaNova && ruaOrig === ruaNova;

    // Ranks: 1=INTEIRO(maior), 2=DRIVE-IN, 3=MEIO, 4=TERCO(menor); 0=desconhecido
    const rankOrig = capPkRank(pkOrig);
    const rankNova = capPkRank(pkNova);
    const tipoOrigLabel = capPkLabel(pkOrig);
    const tipoNovaLabel = capPkLabel(pkNova);

    // — Cálculo de urgência —
    let urgencia = 'Normal';

    if (rankOrig > 0 && rankNova > 0 && pkMudou) {
      // Endereço ficou menor (rank aumentou) — perdeu espaço
      if (rankNova > rankOrig) {
        const salto = rankNova - rankOrig;
        urgencia = salto === 1 ? 'Média' : 'Alta';
      }
      // Endereço ficou maior (rank diminuiu) — ganhou espaço
      else if (rankNova < rankOrig) {
        urgencia = 'Média';
      }
    } else if (!pkMudou) {
      // Mesmo tipo de endereço (ex: TERCO→TERCO, MEIO→MEIO)
      if (diff !== null && diff !== 0) {
        urgencia = 'Baixa'; // mesma categoria mas capacidade mudou
      } else {
        urgencia = 'Normal'; // mesma categoria, capacidade inalterada
      }
    }

    // — Critério Máxima: foi para endereço MAIOR mas capacidade DIMINUIU —
    if (rankOrig > 0 && rankNova > 0 && rankNova < rankOrig && diff !== null && diff < 0) {
      urgencia = 'Máxima';
    }

    return {
      codprod: r.codprod,
      descricao: r.descricao || (orig ? orig.descricao : '') || '',
      capIni, capNova, diff,
      endOrig: orig ? orig.codendereco || '' : '',
      endNova: r.codendereco || '',
      pkOrig, pkNova, pkMudou,
      tipoOrigLabel, tipoNovaLabel,
      rankOrig, rankNova,
      ruaOrig, ruaNova, mesmaRua,
      predioOrig: orig ? orig.predio || '' : '', predioNova: r.predio || '',
      aptoOrig: orig ? orig.apto || '' : '', aptoNova: r.apto || '',
      urgencia
    };
  }) : [];

  // — Último dia com dados de Capacidade Validada —
  let ultimoDiaValidado = null;
  let ultimoDiaRows = [];
  if (cr.length > 0) {
    const allDks = cr.filter(r=>r.dt).map(r=>capDK(r.dt)).filter(Boolean);
    if (allDks.length > 0) {
      ultimoDiaValidado = allDks.reduce((a,b) => a > b ? a : b);
      const ultCr = cr.filter(r => r.dt && capDK(r.dt) === ultimoDiaValidado);
      // Join com 8022 para obter capacidade inicial e nova
      ultimoDiaRows = ultCr.map(r => {
        const base = orig8022Map.get(r.cod) || {};
        const nova = novaMap.get(r.cod) || {};
        const capIni  = base.capacidade != null ? base.capacidade : null;
        const capAtual = nova.capacidade != null ? nova.capacidade : null;
        const diff = (capIni !== null && capAtual !== null) ? capAtual - capIni : null;
        // Prioriza dados de "8022 Nova" para itens que não existem na "8022" original
        const descricao = base.descricao || nova.descricao || '';
        const rua    = base.rua    || nova.rua    || '';
        const predio = base.predio || nova.predio || '';
        const apto   = base.apto   || nova.apto   || '';
        return {
          codprod: r.cod,
          descricao,
          capIni, capAtual, diff,
          tipo: r.tipo,
          rua, predio, apto
        };
      }).sort((a,b) => {
        // Maior diferença primeiro (nulls vão ao fim)
        if (a.diff === null && b.diff === null) return 0;
        if (a.diff === null) return 1;
        if (b.diff === null) return -1;
        return Math.abs(b.diff) - Math.abs(a.diff);
      });
    }
  }

  // — Tabela detalhada de validações (todas ocorrências) —
  // JOIN: validacoesElegiveis × rows8022 × ajustesDetalhes
  const prod8022Map = new Map(rows8022.map(r => [r.codprod, r]));
  const ajusteMap   = new Map(ajustesDetalhes.map(r => [r.codprod, r]));
  const tblDetalhada = validacoesElegiveis.map(r => {
    const base  = prod8022Map.get(r.cod) || {};
    const nova2 = novaMap.get(r.cod) || {};
    const ajust = ajusteMap.get(r.cod) || {};
    return {
      codprod:   r.cod,
      descricao: base.descricao || nova2.descricao || '',
      capIni:    ajust.capIni   != null ? ajust.capIni  : null,
      capAtual:  ajust.capAtual != null ? ajust.capAtual: null,
      diff:      ajust.diff     != null ? ajust.diff    : null,
      status:    ajust.status   || (processed.p8022NovaDispo ? 'Sem Dados' : 'N/D'),
      tipo:      r.tipo,
      dt:        r.dt,
      rua:       base.rua    || nova2.rua    || '',
      predio:    base.predio || nova2.predio || '',
      apto:      base.apto   || nova2.apto   || '',
    };
  });

  // — Ranking de produtos com mais validações —
  const ranking = [...prodContagem.entries()].map(([cod, e]) => {
    const base  = prod8022Map.get(cod) || {};
    const nova2 = novaMap.get(cod) || {};
    const ult  = e.datas.length > 0 ? new Date(Math.max(...e.datas.map(d=>d.getTime()))) : null;
    return { cod, descricao: base.descricao || nova2.descricao || '', total:e.total, prev:e.prev, corr:e.corr, revalidacoes: e.total-1, ultima: ult };
  }).sort((a,b) => b.total - a.total || a.cod.localeCompare(b.cod));

  // — Resumo Sheet Tipo —
  const resumoTipo = (() => {
    const sheetTipo = processed.sheetTipo;
    if (!sheetTipo || !sheetTipo.length) return [];
    // Conjunto de codprods da Tipo (únicos)
    const tipoProdSet = new Set(sheetTipo.filter(r=>r.codprod).map(r=>r.codprod));
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    // Mapa de transferidos por codprod
    const transMap = new Map(itensTransferidos.map(r=>[r.codprod, r]));
    // Mapa CR por codprod
    const crPorProd = new Map();
    (rawCR).forEach(r => {
      if (!crPorProd.has(r.cod)) crPorProd.set(r.cod, []);
      crPorProd.get(r.cod).push(r);
    });

    return [...tipoProdSet].map(codprod => {
      // Dados da 8022 Nova (endereço atual)
      const nova = novaMap.get(codprod);
      const descricao = nova ? nova.descricao || '' : '';
      // Transferência?
      const trans = transMap.get(codprod);
      const transferido = !!trans;
      const endAnterior = transferido ? [trans.ruaOrig, trans.predioOrig, trans.aptoOrig].filter(Boolean).join('-') || trans.endOrig : '';
      const endNovo = nova ? [nova.rua, nova.predio, nova.apto].filter(Boolean).join('-') || nova.codendereco : '';
      // Ocorrências da Tipo para este produto
      const ocorrencias = sheetTipo.filter(r=>r.codprod===codprod && r.dt);
      const datasUteis = new Set(ocorrencias.filter(r=>r.dt.getDay()>=1&&r.dt.getDay()<=5).map(r=>capDK(r.dt)).filter(Boolean));
      const diasComOcorrencia = datasUteis.size;
      // Última ocorrência
      const datasArr = [...datasUteis].sort();
      const ultimaOcorDK = datasArr.length ? datasArr[datasArr.length-1] : null;
      const ultimaOcorDate = ultimaOcorDK ? (() => { const [y,m,d]=ultimaOcorDK.split('-'); return new Date(+y,+m-1,+d); })() : null;
      const diasDesdeOcor = ultimaOcorDate ? capDiasDesde(ultimaOcorDate) : null;
      // Histórico CR
      const crList = crPorProd.get(codprod) || [];
      const qtdPrev = crList.filter(r=>r.tipo==='PREVENTIVO').length;
      const qtdCorr = crList.filter(r=>r.tipo==='CORRETIVO').length;
      const ultimaValDates = crList.filter(r=>r.dt).map(r=>r.dt);
      const ultimaVal = ultimaValDates.length ? new Date(Math.max(...ultimaValDates.map(d=>d.getTime()))) : null;
      return { codprod, descricao, transferido, endAnterior, endNovo, diasComOcorrencia, diasDesdeOcor, ultimaVal, qtdPrev, qtdCorr };
    }).sort((a,b)=>a.codprod.localeCompare(b.codprod));
  })();

  return {
    dispo8022: processed.p8022CDDispo,
    dispoCR: processed.capacidadeRealizadaDispo,
    dispoCRNova: processed.p8022NovaDispo,
    // Indicadores
    totalElegiveis, totalUnicoValidados, cobertura, pendentes,
    totalValidacoes, totalPreventivo, totalCorretivo,
    prodsRecorrencia, pctRecorrencia, revalidacoes,
    ajustePos, ajusteNeg, nenhumAjuste,
    mediaDiariaUnicos, previsaoDias,
    // Análises
    diasOrdenados,
    semanasOrdenadas,
    ranking,
    tblDetalhada,
    rows8022, // para tabela principal
    rows8022N, // para gráfico por rua
    uniqueValidadosPorCod: uniqueValidados, // Set de codprod validados
    ajustesDetalhes,
    // Novos
    itensEntrados,
    itensSaidos,
    itensTransferidos,
    ultimoDiaValidado,
    ultimoDiaRows,
    resumoTipo,
  };
}

/* ---- RENDER PRINCIPAL ---- */
function renderCapacidadeCD() {
  const pane = $('#pane-capacidade');
  if (!pane) return;
  capDestroyCharts();

  const processed = window.APP_STATE && window.APP_STATE.processed ? window.APP_STATE.processed : null;
  if (!processed) {
    pane.innerHTML = `<div class="panel-section" style="text-align:center;padding:60px 20px;color:#7a8798;">Nenhum arquivo carregado. Faça o upload do arquivo NUCLEO REPOSIÇÃO.</div>`;
    return;
  }

  // Validação das abas
  const avisos = [];
  if (!processed.p8022CDDispo)               avisos.push('⚠️ A aba <strong>8022</strong> não foi encontrada. A análise de Capacidade CD não pode ser calculada.');
  if (!processed.capacidadeRealizadaDispo)   avisos.push('⚠️ A aba <strong>Capacidade Realizada</strong> não foi encontrada. Os indicadores de validação não estarão disponíveis.');
  if (!processed.p8022NovaDispo)             avisos.push('⚠️ A aba <strong>8022 Nova</strong> não foi encontrada. A análise de ajustes de capacidade não está disponível.');

  if (!processed.p8022CDDispo) {
    pane.innerHTML = `<div class="panel-section">${avisos.map(a=>`<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;margin-bottom:8px;font-size:13px;">${a}</div>`).join('')}</div>`;
    return;
  }

  const comp = capCompute(processed);

  // ---- Formatos ----
  const fN  = n => (n==null||isNaN(n)) ? '—' : Number(n).toLocaleString('pt-BR');
  const fP  = n => (n==null||isNaN(n)) ? '—' : n.toFixed(1)+'%';
  const fDt = d => !d ? '—' : `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  const fDiff = n => n==null ? '—' : (n>0?'+':'')+n;

  // Construção de um card de indicador
  const mkCard = (icon, label, value, sub='', cor='#1a4480') =>
    `<div class="cap-card"><div class="cap-card-icon" style="color:${cor}">${icon}</div>
      <div class="cap-card-label">${label}</div>
      <div class="cap-card-value" style="color:${cor}">${value}</div>
      ${sub?`<div class="cap-card-sub">${sub}</div>`:''}
    </div>`;

  // Badge status ajuste
  const badgeAjuste = s => {
    const map = {'Ajuste Positivo':['#1a9c62','#e6f9f0'],'Ajuste Negativo':['#d64545','#fdf0f0'],'Nenhum Ajuste':['#7a8798','#f4f6f8'],'N/D':['#bdbdbd','#f9f9f9'],'Sem Dados':['#bdbdbd','#f9f9f9'],'Sem Correspondência':['#bdbdbd','#f9f9f9']};
    const [c,bg] = map[s] || ['#7a8798','#f4f6f8'];
    return `<span style="background:${bg};color:${c};font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;border:1px solid ${c}30;">${s}</span>`;
  };

  // ---- Cabeçalho com filtros (painel de controle) ----
  const fmtInputDate = d => !d ? '' : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  // Lista de produtos únicos da 8022 Nova para dropdown
  const _prodListDropdown = (() => {
    const lista = [];
    const seen = new Set();
    const src = processed.p8022Nova || processed.p8022CDRows || [];
    src.forEach(r => {
      if(r.codprod && !seen.has(r.codprod)) {
        seen.add(r.codprod);
        lista.push({cod: r.codprod, desc: r.descricao || ''});
      }
    });
    lista.sort((a,b) => a.cod.localeCompare(b.cod));
    return lista;
  })();

  const _prodOpts = _prodListDropdown.map(p =>
    `<option value="${p.cod}" ${CapCDState.filtroProdutos.includes(p.cod)?'selected':''}>${p.cod}${p.desc?' — '+p.desc.substring(0,35):''}</option>`
  ).join('');

  // Atalhos — mesmo estilo de renderAtalhos()
  const capAtalhoHTML = ['mesAtual','mesAnt','anoAtual','anoAnt','tudo'].map(key => {
    const labels = {mesAtual:'Mês Atual',mesAnt:'Mês Anterior',anoAtual:'Ano Atual',anoAnt:'Ano Anterior',tudo:'Tudo'};
    const ativo = CapCDState.filtroAtalho === key;
    return `<button onclick="capSetAtalho('${key}')"
      style="padding:5px 12px;font-size:11px;font-weight:${ativo?'800':'600'};border-radius:6px;
             border:1.5px solid ${ativo?'#0b2647':'#b8c4d4'};
             background:${ativo?'#0b2647':'#fff'};color:${ativo?'#fff':'#1a4480'};
             cursor:pointer;transition:all .15s;">${labels[key]}</button>`;
  }).join('');

  // Toggle genérico — mesmo padrão de Relações Rep
  const capToggleBtn = (label, ativo, onclick) =>
    `<button onclick="${onclick}"
      style="padding:5px 14px;font-size:11px;font-weight:${ativo?'800':'600'};border-radius:6px;
             border:1.5px solid ${ativo?'#0b2647':'#b8c4d4'};
             background:${ativo?'#0b2647':'#fff'};color:${ativo?'#fff':'#1a4480'};
             cursor:pointer;">${label}</button>`;

  const filtroHTML = `
    <div style="background:#f7f9fc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:14px;">
      <!-- Linha 1: Filtros globais -->
      <div class="toolbar" style="flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:12px;">

        <div class="filter-group" style="flex:2;min-width:220px;">
          <label>Produto / Código</label>
          <div style="position:relative;" id="cap-combo-wrap">
            <input type="text" id="cap-prod-search" autocomplete="off"
              placeholder="${CapCDState.filtroProdutos.length>0?CapCDState.filtroProdutos.length+' selecionado(s)':'Buscar código ou nome...'}"
              style="width:100%;box-sizing:border-box;padding:5px 28px 5px 8px;border:1px solid #c8d0db;border-radius:6px;font-size:12px;background:#fff;"
              onfocus="capComboOpen()"
              oninput="capComboFilter(this.value)">
            <span style="position:absolute;right:8px;top:50%;transform:translateY(-50%);color:#7a8798;pointer-events:none;font-size:11px;">▼</span>
            <div id="cap-combo-list" style="display:none;position:absolute;z-index:2000;top:100%;left:0;right:0;background:#fff;border:1px solid #c8d0db;border-top:none;border-radius:0 0 6px 6px;max-height:200px;overflow-y:auto;box-shadow:0 4px 12px rgba(0,0,0,.1);">
              <div data-val="" onclick="capComboToggle(this)" style="padding:6px 10px;font-size:12px;cursor:pointer;color:#7a8798;border-bottom:1px solid #f0f0f0;">— Todos —</div>
              ${_prodListDropdown.map(p=>`<div data-val="${p.cod}" onclick="capComboToggle(this)" style="padding:5px 10px;font-size:11px;cursor:pointer;${CapCDState.filtroProdutos.includes(p.cod)?'background:#e8f0fe;font-weight:700;':''}"><span class="cap-combo-chk" style="margin-right:6px;">${CapCDState.filtroProdutos.includes(p.cod)?'☑':'☐'}</span>${p.cod}${p.desc?' — '+p.desc.substring(0,35):''}</div>`).join('')}
            </div>
          </div>
          ${CapCDState.filtroProdutos.length>0
            ? `<button onclick="CapCDState.filtroProdutos=[];renderCapacidadeCD();"
                 style="margin-top:3px;font-size:11px;color:#d64545;background:none;border:none;cursor:pointer;padding:0;">
                 Limpar (${CapCDState.filtroProdutos.length} selecionados)</button>`
            : ''}
        </div>

        <div class="filter-group">
          <label>Data Inicial</label>
          <input type="date" id="cap-dt-ini" value="${fmtInputDate(CapCDState.filtroIni)}"
            onchange="CapCDState.filtroIni=this.value?new Date(this.value+'T00:00:00'):null;CapCDState.filtroAtalho='custom';CapCDState.detPage=0;renderCapacidadeCD();">
        </div>

        <div class="filter-group">
          <label>Data Final</label>
          <input type="date" id="cap-dt-fim" value="${fmtInputDate(CapCDState.filtroFim)}"
            onchange="CapCDState.filtroFim=this.value?new Date(this.value+'T23:59:59'):null;CapCDState.filtroAtalho='custom';CapCDState.detPage=0;renderCapacidadeCD();">
        </div>

        <div class="filter-group">
          <label>Atalhos de Período</label>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">${capAtalhoHTML}</div>
        </div>

        <div class="filter-group">
          <label>Revenda</label>
          <div style="display:flex;gap:4px;">
            ${capToggleBtn('Todos', CapCDState.filtroRevenda==='todos', "CapCDState.filtroRevenda='todos';renderCapacidadeCD();")}
            ${capToggleBtn('Sem Revenda', CapCDState.filtroRevenda==='nao', "CapCDState.filtroRevenda='nao';renderCapacidadeCD();")}
          </div>
          ${CapCDState.filtroRevenda==='nao'
            ? `<span style="font-size:10px;color:#d64545;display:block;margin-top:3px;">⚠️ Revenda excluída</span>`
            : ''}
        </div>

        <div class="filter-group">
          <label>&nbsp;</label>
          <button onclick="capVerRegras();" style="padding:6px 14px;border-radius:6px;border:1.5px solid #1a9c62;background:#edfaf4;color:#1a9c62;font-size:12px;font-weight:700;cursor:pointer;">Ver Regras</button>
        </div>

      </div>

      <!-- Linha 2: Gerar Demanda -->
      <div style="border-top:1px solid #e2e8f0;padding-top:12px;">
        <div style="font-size:12px;font-weight:700;color:#1a4480;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;">⚡ Gerar Demanda</div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start;">

          <div class="filter-group">
            <label>Não Validado</label>
            <div style="display:flex;gap:4px;">
              ${capToggleBtn('SIM', CapCDState.demandaNaoValidado, "CapCDState.demandaNaoValidado=true;renderCapacidadeCD();")}
              ${capToggleBtn('NÃO', !CapCDState.demandaNaoValidado, "CapCDState.demandaNaoValidado=false;renderCapacidadeCD();")}
            </div>
          </div>

          <div class="filter-group">
            <label>Corretivo Ocorrência</label>
            <div style="display:flex;gap:4px;">
              ${capToggleBtn('SIM', CapCDState.demandaCorretivo, "CapCDState.demandaCorretivo=true;renderCapacidadeCD();")}
              ${capToggleBtn('NÃO', !CapCDState.demandaCorretivo, "CapCDState.demandaCorretivo=false;renderCapacidadeCD();")}
            </div>
          </div>

          <div class="filter-group">
            <label>Transferido Preventivo</label>
            <div style="display:flex;gap:4px;">
              ${capToggleBtn('SIM', CapCDState.demandaTransferido, "CapCDState.demandaTransferido=true;renderCapacidadeCD();")}
              ${capToggleBtn('NÃO', !CapCDState.demandaTransferido, "CapCDState.demandaTransferido=false;renderCapacidadeCD();")}
            </div>
          </div>

          <div class="filter-group">
            <label>Imprimir Rua por Página</label>
            <div style="display:flex;gap:4px;">
              ${capToggleBtn('SIM', CapCDState.demandaRuaPorPagina, "CapCDState.demandaRuaPorPagina=true;renderCapacidadeCD();")}
              ${capToggleBtn('NÃO', !CapCDState.demandaRuaPorPagina, "CapCDState.demandaRuaPorPagina=false;renderCapacidadeCD();")}
            </div>
            <span style="font-size:10px;color:#7a8798;">${CapCDState.demandaRuaPorPagina ? '1 rua por página' : 'Tudo em sequência'}</span>
          </div>

          ${processed.sheetTipoDispo ? `
          <div class="filter-group">
            <label>Período Sheet Tipo</label>
            <div style="display:flex;gap:6px;align-items:center;">
              <input type="date" value="${fmtInputDate(CapCDState.demandaTipoIni)}"
                style="border:1px solid #c8d0db;border-radius:6px;padding:4px 7px;font-size:11px;"
                onchange="CapCDState.demandaTipoIni=this.value?new Date(this.value+'T00:00:00'):null;renderCapacidadeCD();">
              <span style="font-size:11px;color:#7a8798;">até</span>
              <input type="date" value="${fmtInputDate(CapCDState.demandaTipoFim)}"
                style="border:1px solid #c8d0db;border-radius:6px;padding:4px 7px;font-size:11px;"
                onchange="CapCDState.demandaTipoFim=this.value?new Date(this.value+'T23:59:59'):null;renderCapacidadeCD();">
              ${(CapCDState.demandaTipoIni||CapCDState.demandaTipoFim)?`<button onclick="CapCDState.demandaTipoIni=null;CapCDState.demandaTipoFim=null;renderCapacidadeCD();" style="font-size:11px;color:#d64545;background:none;border:none;cursor:pointer;">✕</button>`:''}
            </div>
            <span style="font-size:10px;color:#7a8798;">Padrão: último dia útil disponível</span>
          </div>` : `<div class="filter-group"><label>Sheet Tipo</label><span style="font-size:11px;color:#e07b00;">⚠️ Aba não encontrada</span></div>`}

          <!-- Intervalo de ruas / diluição -->
          <div class="filter-group" style="min-width:200px;">
            <label>Intervalo de Ruas (opcional)</label>
            <div style="display:flex;gap:5px;align-items:center;">
              <input type="number" min="1" placeholder="Rua ini"
                value="${CapCDState.demandaRuaIni}"
                style="width:66px;border:1px solid #c8d0db;border-radius:6px;padding:4px 6px;font-size:11px;"
                onchange="CapCDState.demandaRuaIni=this.value;">
              <span style="font-size:11px;color:#7a8798;">até</span>
              <input type="number" min="1" placeholder="Rua fim"
                value="${CapCDState.demandaRuaFim}"
                style="width:66px;border:1px solid #c8d0db;border-radius:6px;padding:4px 6px;font-size:11px;"
                onchange="CapCDState.demandaRuaFim=this.value;">
              ${(CapCDState.demandaRuaIni||CapCDState.demandaRuaFim)?`<button onclick="CapCDState.demandaRuaIni='';CapCDState.demandaRuaFim='';CapCDState.demandaQtdItens='';renderCapacidadeCD();" style="font-size:11px;color:#d64545;background:none;border:none;cursor:pointer;">✕</button>`:''}
            </div>
          </div>

          <div class="filter-group" style="min-width:140px;">
            <label>Qtd Total de Itens</label>
            <input type="number" min="1" placeholder="Ex: 500"
              value="${CapCDState.demandaQtdItens}"
              style="width:100%;border:1px solid #c8d0db;border-radius:6px;padding:4px 6px;font-size:11px;box-sizing:border-box;"
              onchange="CapCDState.demandaQtdItens=this.value;">
            ${(CapCDState.demandaRuaIni && CapCDState.demandaRuaFim && CapCDState.demandaQtdItens) ? (() => {
              const ini = parseInt(CapCDState.demandaRuaIni,10), fim = parseInt(CapCDState.demandaRuaFim,10), qt = parseInt(CapCDState.demandaQtdItens,10);
              if (!isNaN(ini)&&!isNaN(fim)&&ini<=fim&&!isNaN(qt)&&qt>0) {
                const n = fim-ini+1; const pp = Math.floor(qt/n);
                return `<span style="font-size:10px;color:#1a9c62;display:block;margin-top:3px;">≈ ${pp} itens/rua (${n} ruas)</span>`;
              } return '';
            })() : ''}
          </div>

          <div class="filter-group">
            <label>&nbsp;</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button onclick="capGerarDemandaAction();"
                style="padding:7px 18px;border-radius:6px;border:none;background:#1a4480;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Gerar Demanda</button>
              ${CapCDState.demandaGerada ? `<button onclick="capDemandaPreviewPDF();" style="padding:7px 14px;border-radius:6px;border:1.5px solid #1a4480;background:#fff;color:#1a4480;font-size:12px;font-weight:700;cursor:pointer;">Preview PDF</button>
              <button onclick="capDemandaExportPDF();" style="padding:7px 14px;border-radius:6px;border:none;background:#e07b00;color:#fff;font-size:12px;font-weight:700;cursor:pointer;">Gerar PDF</button>` : ''}
              ${CapCDState.demandaGerada ? `<button onclick="CapCDState.demandaGerada=null;CapCDState.demandaPage=0;renderCapacidadeCD();" style="padding:7px 10px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;color:#7a8798;font-size:11px;cursor:pointer;">Limpar</button>` : ''}
            </div>
          </div>

        </div>
      </div>
    </div>`;

  // ---- Avisos de abas ausentes ----
  const avisosHTML = avisos.map(a=>`<div class="cap-aviso">${a}</div>`).join('');

  // ---- Cards linha 1: Cobertura ----
  const l1 = `
    <div class="cap-cards-row">
      ${mkCard('📦','Total de Itens Elegíveis', fN(comp.totalElegiveis), 'NIVEL = 1 na sheet 8022')}
      ${mkCard('✅','Itens Únicos Validados', fN(comp.totalUnicoValidados), `de ${fN(comp.totalElegiveis)} elegíveis`,'#1a9c62')}
      ${mkCard('📊','Cobertura do Estoque', fP(comp.cobertura), 'Únicos validados / Elegíveis', comp.cobertura>=100?'#1a9c62':comp.cobertura>=70?'#1a4480':'#e07b00')}
      ${mkCard('⏳','Itens Pendentes', fN(comp.pendentes), 'Ainda não validados','#d64545')}
    </div>`;

  // ---- Cards linha 2: Produtividade ----
  const l2 = `
    <div class="cap-cards-row">
      ${mkCard('🔢','Total de Validações', fN(comp.totalValidacoes), 'Todas as ocorrências')}
      ${mkCard('🛡️','Preventivas', fN(comp.totalPreventivo), comp.totalValidacoes>0?fP(comp.totalPreventivo/comp.totalValidacoes*100)+' do total':'')}
      ${mkCard('🔧','Corretivas', fN(comp.totalCorretivo), comp.totalValidacoes>0?fP(comp.totalCorretivo/comp.totalValidacoes*100)+' do total':'')}
      ${mkCard('🔁','Revalidações', fN(comp.revalidacoes), 'Validações além da 1ª por produto','#1a9c62')}
    </div>`;

  // ---- Cards linha 3: Recorrência ----
  const l3 = `
    <div class="cap-cards-row">
      ${mkCard('🔄','Produtos c/ Recorrência', fN(comp.prodsRecorrencia), 'Mais de 1 validação','#e07b00')}
      ${mkCard('%','% com Recorrência', fP(comp.pctRecorrencia), 'Sobre únicos validados','#e07b00')}
    </div>`;

  // ---- Cards linha 4: Ajustes ----
  const ajHTML = !processed.p8022NovaDispo ?
    `<div class="cap-aviso-inline">⚠️ 8022 Nova não carregada — análise de ajustes indisponível</div>` :
    `<div class="cap-cards-row">
      ${mkCard('📈','Ajustes Positivos', fN(comp.ajustePos), 'Capacidade aumentou','#1a9c62')}
      ${mkCard('📉','Ajustes Negativos', fN(comp.ajusteNeg), 'Capacidade diminuiu','#d64545')}
      ${mkCard('🔵','Nenhum Ajuste', fN(comp.nenhumAjuste), 'Capacidade mantida','#1a4480')}
      ${mkCard('✅','Total Validado (ajustes)', fN(comp.ajustePos+comp.ajusteNeg+comp.nenhumAjuste), '')}
    </div>`;

  // ---- Card previsão ----
  const previsaoHTML = `
    <div class="cap-previsao-card">
      <div class="cap-previsao-title">🗓️ Projeção para Zerar Validação Capacidade Ciclica</div>
      <div class="cap-previsao-row">
        <div class="cap-previsao-item"><span class="cap-previsao-num">${fN(Math.round(comp.mediaDiariaUnicos*10)/10)}</span><span class="cap-previsao-lbl">itens únicos/dia</span></div>
        <div class="cap-previsao-item"><span class="cap-previsao-num">${fN(comp.pendentes)}</span><span class="cap-previsao-lbl">pendentes</span></div>
        <div class="cap-previsao-item"><span class="cap-previsao-num" style="color:${comp.previsaoDias===null?'#7a8798':comp.previsaoDias<=7?'#1a9c62':'#e07b00'}">${comp.previsaoDias===null?'—':comp.previsaoDias+' dias'}</span><span class="cap-previsao-lbl">previsão</span></div>
      </div>
      ${comp.previsaoDias===null?`<div style="font-size:11px;color:#7a8798;margin-top:6px;">Dados insuficientes para projeção</div>`:''}
    </div>`;

  // ---- Tabela Capacidade Ultima Validação (agora = Detalhada + toggle de filtro) ----
  const fDiffCol = (n) => n==null ? '—' : (n>0?`<span style="color:#1a9c62;font-weight:700;">+${n}</span>`:(n<0?`<span style="color:#d64545;font-weight:700;">${n}</span>`:`<span style="color:#7a8798;">0</span>`));
  const ultDtLabel = comp.ultimoDiaValidado ? (() => {
    const [y,m,d] = comp.ultimoDiaValidado.split('-');
    return `${d}/${m}/${y}`;
  })() : '—';

  // Fonte: toggle SIM → só último dia com dados; NÃO → todo período filtrado
  const _ultValBase = [...comp.tblDetalhada];
  const ultValRows = CapCDState.ultValSoUltimoDia
    ? _ultValBase.filter(r => r.dt && comp.ultimoDiaValidado && r.dt.toISOString().slice(0,10) === comp.ultimoDiaValidado)
    : _ultValBase;
  ultValRows.sort((a,b)=>{
    if(a.diff===null&&b.diff===null) return 0;
    if(a.diff===null) return 1; if(b.diff===null) return -1;
    return Math.abs(b.diff)-Math.abs(a.diff);
  });
  const ultValTotal = ultValRows.length;
  const _ultValPage = CapCDState.ultValPage||0;
  const ultValSlice = ultValRows.slice(_ultValPage * CapCDState.detPageSize, (_ultValPage+1) * CapCDState.detPageSize);
  const ultValPages = Math.ceil(ultValTotal / CapCDState.detPageSize);

  const ultimoValHTML = `
    <div class="cap-section-title">📋 Tabela Capacidade — Última Validação
      <span style="font-size:12px;font-weight:400;color:#7a8798;">${comp.ultimoDiaValidado?'Último dia c/ dados: '+ultDtLabel:''} &nbsp;·&nbsp; ${fN(ultValTotal)} ocorrências</span>
    </div>
    <div class="cap-controls-row" style="margin-bottom:8px;">
      <label class="cap-toggle-label" style="font-weight:600;font-size:12px;">Mostrar Últimas Validações:</label>
      <div class="cap-toggle-group">
        ${capToggleBtn('SIM', CapCDState.ultValSoUltimoDia, "CapCDState.ultValSoUltimoDia=true;CapCDState.ultValPage=0;renderCapacidadeCD();")}
        ${capToggleBtn('NÃO', !CapCDState.ultValSoUltimoDia, "CapCDState.ultValSoUltimoDia=false;CapCDState.ultValPage=0;renderCapacidadeCD();")}
      </div>
      <span style="font-size:10px;color:#7a8798;margin-left:8px;">${CapCDState.ultValSoUltimoDia ? 'Exibindo apenas ' + ultDtLabel : 'Exibindo todo o período filtrado'}</span>
    </div>
    ${ultValTotal===0?`<div class="cap-aviso-inline">⚠️ Sem dados de validação${CapCDState.ultValSoUltimoDia?' para o último dia':' no período'}.</div>`:
    `<div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>CODPROD</th>
        <th>Descrição</th>
        <th>Cap. Inicial</th>
        <th>Cap. Atual</th>
        <th>Diferença</th>
        <th>Status Ajuste</th>
        <th>Tipo</th>
        <th>Data</th>
        <th>RUA</th>
        <th>PRÉDIO</th>
        <th>APTO</th>
      </tr></thead>
      <tbody>
      ${ultValSlice.map(r=>`<tr>
        <td><strong>${escapeHtml(r.codprod)}</strong></td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
        <td>${r.capIni!=null?fN(r.capIni):'—'}</td>
        <td>${r.capAtual!=null?fN(r.capAtual):'—'}</td>
        <td style="font-weight:700;color:${r.diff==null?'#7a8798':r.diff>0?'#1a9c62':r.diff<0?'#d64545':'#7a8798'}">${fDiff(r.diff)}</td>
        <td>${badgeAjuste(r.status)}</td>
        <td><span style="background:${r.tipo==='PREVENTIVO'?'#e6f9f0':'#fdf0f0'};color:${r.tipo==='PREVENTIVO'?'#1a9c62':'#d64545'};font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;">${escapeHtml(r.tipo||'')}</span></td>
        <td>${fDt(r.dt)}</td>
        <td>${escapeHtml(r.rua)}</td><td>${escapeHtml(r.predio)}</td><td>${escapeHtml(r.apto)}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>
    ${ultValPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.ultValPage=Math.max(0,(CapCDState.ultValPage||0)-1);renderCapacidadeCD();" ${_ultValPage===0?'disabled':''}>◀</button>
      <span>${_ultValPage+1} / ${ultValPages}</span>
      <button onclick="CapCDState.ultValPage=Math.min(${ultValPages-1},(CapCDState.ultValPage||0)+1);renderCapacidadeCD();" ${_ultValPage===ultValPages-1?'disabled':''}>▶</button>
    </div>`:''}`}`;

  // ---- Itens Entrados no Estoque (paginado) ----
  const entTotal = comp.itensEntrados.length;
  const entStart = CapCDState.entradosPage * CapCDState.entradosPageSize;
  const entSlice = comp.itensEntrados.slice(entStart, entStart + CapCDState.entradosPageSize);
  const entPages = Math.ceil(entTotal / CapCDState.entradosPageSize);
  const mkEntRow = r => `<tr>
    <td><strong>${escapeHtml(r.codprod)}</strong></td>
    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
    <td>${r.capacidade!=null?r.capacidade:'—'}</td>
    <td>${escapeHtml(r.codendereco)}</td>
    <td>${escapeHtml(r.pk_end)}</td>
    <td>${escapeHtml(r.rua)}</td><td>${escapeHtml(r.predio)}</td><td>${escapeHtml(r.apto)}</td>
  </tr>`;
  const entradosHTML = !processed.p8022NovaDispo ? '' : `
    <div class="cap-section-title">🟢 Itens que Entraram no Estoque
      <span style="font-size:12px;font-weight:400;color:#7a8798;">(${fN(entTotal)} itens em 8022 Nova mas não em 8022)</span>
    </div>
    ${entTotal===0?`<div class="cap-aviso-inline" style="background:#e6f9f0;border-color:#1a9c62;color:#1a9c62;">✅ Nenhum item novo no estoque.</div>`:
    `<div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>CODPROD</th><th>Descrição</th><th>Capacidade</th>
        <th>Endereço</th><th>PK_END</th><th>RUA</th><th>PRÉDIO</th><th>APTO</th>
      </tr></thead>
      <tbody>${entSlice.map(mkEntRow).join('')}</tbody>
    </table></div>
    ${entPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.entradosPage=Math.max(0,CapCDState.entradosPage-1);renderCapacidadeCD();" ${CapCDState.entradosPage===0?'disabled':''}>◀</button>
      <span>${CapCDState.entradosPage+1} / ${entPages}</span>
      <button onclick="CapCDState.entradosPage=Math.min(${entPages-1},CapCDState.entradosPage+1);renderCapacidadeCD();" ${CapCDState.entradosPage===entPages-1?'disabled':''}>▶</button>
    </div>`:''}`}`;

  // ---- Itens Saídos do Estoque (paginado) ----
  const saiTotal = comp.itensSaidos.length;
  const saiStart = CapCDState.saidosPage * CapCDState.saidosPageSize;
  const saiSlice = comp.itensSaidos.slice(saiStart, saiStart + CapCDState.saidosPageSize);
  const saiPages = Math.ceil(saiTotal / CapCDState.saidosPageSize);
  const mkSaiRow = r => `<tr>
    <td><strong>${escapeHtml(r.codprod)}</strong></td>
    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
    <td>${r.capacidade!=null?r.capacidade:'—'}</td>
    <td>${escapeHtml(r.codendereco)}</td>
    <td>${escapeHtml(r.pk_end)}</td>
    <td>${escapeHtml(r.rua)}</td><td>${escapeHtml(r.predio)}</td><td>${escapeHtml(r.apto)}</td>
  </tr>`;
  const saidosHTML = !processed.p8022NovaDispo ? '' : `
    <div class="cap-section-title">🔴 Itens que Saíram do Estoque
      <span style="font-size:12px;font-weight:400;color:#7a8798;">(${fN(saiTotal)} itens em 8022 mas não em 8022 Nova — excluídos dos pendentes)</span>
    </div>
    ${saiTotal===0?`<div class="cap-aviso-inline" style="background:#e6f9f0;border-color:#1a9c62;color:#1a9c62;">✅ Nenhum item saiu do estoque.</div>`:
    `<div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>CODPROD</th><th>Descrição</th><th>Capacidade</th>
        <th>Endereço</th><th>PK_END</th><th>RUA</th><th>PRÉDIO</th><th>APTO</th>
      </tr></thead>
      <tbody>${saiSlice.map(mkSaiRow).join('')}</tbody>
    </table></div>
    ${saiPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.saidosPage=Math.max(0,CapCDState.saidosPage-1);renderCapacidadeCD();" ${CapCDState.saidosPage===0?'disabled':''}>◀</button>
      <span>${CapCDState.saidosPage+1} / ${saiPages}</span>
      <button onclick="CapCDState.saidosPage=Math.min(${saiPages-1},CapCDState.saidosPage+1);renderCapacidadeCD();" ${CapCDState.saidosPage===saiPages-1?'disabled':''}>▶</button>
    </div>`:''}`}`;

  // ---- Itens Transferidos ----
  const urgOrdem  = {'Máxima':0,'Alta':1,'Média':2,'Baixa':3,'Normal':4};
  const urgBgMap  = {'Máxima':'#7c1d1d','Alta':'#d64545','Média':'#e07b00','Baixa':'#1a9c62','Normal':'#2563aa'};
  const urgRowBg  = {'Máxima':'#fce8e8','Alta':'#fdf0f0','Média':'#fff8ee','Baixa':'#edfaf4','Normal':''};
  const maxCount  = comp.itensTransferidos.filter(r=>r.urgencia==='Máxima').length;
  const altaCount = comp.itensTransferidos.filter(r=>r.urgencia==='Alta').length;
  const medCount  = comp.itensTransferidos.filter(r=>r.urgencia==='Média').length;
  const baixaCount= comp.itensTransferidos.filter(r=>r.urgencia==='Baixa').length;
  const normCount = comp.itensTransferidos.filter(r=>r.urgencia==='Normal').length;

  // Filtros de transferidos
  const mkUrgBtn = (key, label, count, color) => {
    const ativo = CapCDState.filtroUrgencia === key;
    return `<button onclick="CapCDState.filtroUrgencia='${key}';renderCapacidadeCD();" style="padding:5px 12px;border-radius:16px;border:2px solid ${color};background:${ativo?color:'#fff'};color:${ativo?'#fff':color};font-size:11px;font-weight:700;cursor:pointer;">${label} <span style="background:${ativo?'rgba(255,255,255,.25)':'rgba(0,0,0,.08)'};padding:1px 6px;border-radius:10px;">${count}</span></button>`;
  };
  const mkOriBtn = (key, label) => {
    const ativo = CapCDState.filtroOrigem === key;
    return `<button onclick="CapCDState.filtroOrigem='${key}';renderCapacidadeCD();" style="padding:4px 10px;border-radius:12px;border:1px solid ${ativo?'#1a4480':'#c8d0db'};background:${ativo?'#1a4480':'#fff'};color:${ativo?'#fff':'#374151'};font-size:11px;cursor:pointer;">${label}</button>`;
  };

  // Aplica filtros na lista de transferidos
  let transFiltered = [...comp.itensTransferidos];
  if (CapCDState.filtroUrgencia === 'maxalta') transFiltered = transFiltered.filter(r => r.urgencia === 'Máxima' || r.urgencia === 'Alta');
  else if (CapCDState.filtroUrgencia !== 'todos') transFiltered = transFiltered.filter(r => r.urgencia === CapCDState.filtroUrgencia);
  if (CapCDState.filtroOrigem !== 'todos') {
    const oriMap = {inteiro:'1', drivein:'2', meio:'8', terco:'9'};
    const oriPfx = oriMap[CapCDState.filtroOrigem];
    if (oriPfx) transFiltered = transFiltered.filter(r => String(r.pkOrig||'').startsWith(oriPfx));
  }
  if (CapCDState.filtroDiffIni !== '' || CapCDState.filtroDiffFim !== '') {
    const dIni = CapCDState.filtroDiffIni !== '' ? Number(CapCDState.filtroDiffIni) : null;
    const dFim = CapCDState.filtroDiffFim !== '' ? Number(CapCDState.filtroDiffFim) : null;
    transFiltered = transFiltered.filter(r => {
      if (r.diff === null) return false;
      if (dIni !== null && r.diff < dIni) return false;
      if (dFim !== null && r.diff > dFim) return false;
      return true;
    });
  }

  const transferidosHTML = !processed.p8022NovaDispo ? '' : `
    <div class="cap-section-title">🔄 Itens Transferidos (Endereço Alterado)</div>

    <!-- Cards de urgência -->
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
      ${[
        {u:'Máxima',c:'#7c1d1d',n:maxCount},
        {u:'Alta',c:'#d64545',n:altaCount},
        {u:'Média',c:'#e07b00',n:medCount},
        {u:'Baixa',c:'#1a9c62',n:baixaCount},
        {u:'Normal',c:'#2563aa',n:normCount},
      ].map(({u,c,n})=>`<div style="background:#fff;border:2px solid ${c}30;border-radius:10px;padding:10px 18px;min-width:100px;text-align:center;cursor:pointer;" onclick="CapCDState.filtroUrgencia='${u}';renderCapacidadeCD();">
        <div style="font-size:19px;font-weight:800;color:${c};">${n}</div>
        <div style="font-size:10px;font-weight:700;color:${c};text-transform:uppercase;letter-spacing:.5px;">${u}</div>
      </div>`).join('')}
      <div style="background:#f4f6f8;border:1px solid #c8d0db;border-radius:10px;padding:10px 18px;min-width:100px;text-align:center;cursor:pointer;" onclick="CapCDState.filtroUrgencia='todos';renderCapacidadeCD();">
        <div style="font-size:19px;font-weight:800;color:#374151;">${comp.itensTransferidos.length}</div>
        <div style="font-size:10px;font-weight:700;color:#7a8798;text-transform:uppercase;letter-spacing:.5px;">TOTAL</div>
      </div>
    </div>

    <!-- Filtros -->
    <div style="background:#f7f9fc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:12px;">
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
        <div>
          <div style="font-size:10px;font-weight:600;color:#7a8798;text-transform:uppercase;margin-bottom:5px;">Urgência</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${mkUrgBtn('maxalta','Máxima + Alta',maxCount+altaCount,'#7c1d1d')}
            ${mkUrgBtn('todos','Todos',comp.itensTransferidos.length,'#374151')}
            ${mkUrgBtn('Máxima','Máxima',maxCount,'#7c1d1d')}
            ${mkUrgBtn('Alta','Alta',altaCount,'#d64545')}
            ${mkUrgBtn('Média','Média',medCount,'#e07b00')}
            ${mkUrgBtn('Baixa','Baixa',baixaCount,'#1a9c62')}
            ${mkUrgBtn('Normal','Normal',normCount,'#2563aa')}
          </div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:#7a8798;text-transform:uppercase;margin-bottom:5px;">Origem do Endereço</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${mkOriBtn('todos','Todos')}
            ${mkOriBtn('inteiro','INTEIRO → Qualquer')}
            ${mkOriBtn('drivein','DRIVE-IN → Qualquer')}
            ${mkOriBtn('meio','MEIO → Qualquer')}
            ${mkOriBtn('terco','TERCO → Qualquer')}
          </div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:#7a8798;text-transform:uppercase;margin-bottom:5px;">Intervalo Diferença</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <input type="number" placeholder="De" value="${CapCDState.filtroDiffIni}" style="width:65px;border:1px solid #c8d0db;border-radius:6px;padding:4px 7px;font-size:12px;"
              onchange="CapCDState.filtroDiffIni=this.value;renderCapacidadeCD();">
            <span style="font-size:11px;color:#7a8798;">até</span>
            <input type="number" placeholder="Até" value="${CapCDState.filtroDiffFim}" style="width:65px;border:1px solid #c8d0db;border-radius:6px;padding:4px 7px;font-size:12px;"
              onchange="CapCDState.filtroDiffFim=this.value;renderCapacidadeCD();">
            ${(CapCDState.filtroDiffIni!==''||CapCDState.filtroDiffFim!=='')?`<button onclick="CapCDState.filtroDiffIni='';CapCDState.filtroDiffFim='';renderCapacidadeCD();" style="font-size:11px;color:#d64545;background:none;border:none;cursor:pointer;">✕</button>`:''}
          </div>
        </div>
      </div>
      ${(CapCDState.filtroUrgencia!=='todos'||CapCDState.filtroOrigem!=='todos'||CapCDState.filtroDiffIni!==''||CapCDState.filtroDiffFim!=='')?
        `<div style="margin-top:8px;font-size:11px;color:#1a4480;">Mostrando <strong>${transFiltered.length}</strong> de ${comp.itensTransferidos.length} transferidos
        <button onclick="CapCDState.filtroUrgencia='maxalta';CapCDState.filtroOrigem='todos';CapCDState.filtroDiffIni='';CapCDState.filtroDiffFim='';renderCapacidadeCD();" style="margin-left:8px;font-size:11px;color:#d64545;background:none;border:none;cursor:pointer;">Redefinir filtros</button></div>`:''
      }
    </div>

    <div style="font-size:11px;color:#7a8798;margin-bottom:10px;line-height:1.8;">
      <strong>Legenda:</strong>
      <span style="background:#7c1d1d;color:#fff;padding:1px 7px;border-radius:8px;margin:0 3px;">Máxima</span> End. maior, cap. caiu &nbsp;|&nbsp;
      <span style="background:#d64545;color:#fff;padding:1px 7px;border-radius:8px;margin:0 3px;">Alta</span> Mudou 2+ níveis &nbsp;|&nbsp;
      <span style="background:#e07b00;color:#fff;padding:1px 7px;border-radius:8px;margin:0 3px;">Média</span> Mudou 1 nível &nbsp;|&nbsp;
      <span style="background:#1a9c62;color:#fff;padding:1px 7px;border-radius:8px;margin:0 3px;">Baixa</span> Mesmo tipo, cap. alterada &nbsp;|&nbsp;
      <span style="background:#2563aa;color:#fff;padding:1px 7px;border-radius:8px;margin:0 3px;">Normal</span> Mesmo tipo, cap. inalterada
    </div>
    ${transFiltered.length===0?`<div class="cap-aviso-inline" style="background:#e6f9f0;border-color:#1a9c62;color:#1a9c62;">✅ Nenhum item transferido com esses filtros.</div>`:
    `<div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>CODPROD</th><th>Descrição</th><th>Urgência</th>
        <th>Cap. Ant.</th><th>Cap. Nova</th><th>Diferença</th>
        <th>Tipo Ant.</th><th>Tipo Novo</th>
        <th>Rua Ant.</th><th>Rua Nova</th><th>Mesma Rua</th>
        <th>End. Anterior</th><th>End. Novo</th>
      </tr></thead>
      <tbody>
      ${transFiltered.sort((a,b)=>{
        const oa=urgOrdem[a.urgencia]??9, ob=urgOrdem[b.urgencia]??9;
        if(oa!==ob) return oa-ob;
        if(a.diff===null&&b.diff===null) return 0;
        if(a.diff===null) return 1; if(b.diff===null) return -1;
        return Math.abs(b.diff)-Math.abs(a.diff);
      }).map(r=>{
        const bg  = urgBgMap[r.urgencia]  || '#2563aa';
        const rbg = urgRowBg[r.urgencia]  || '';
        const diffColor = r.diff==null?'#7a8798':r.diff>0?'#1a9c62':r.diff<0?'#d64545':'#7a8798';
        const ruaMudou  = r.ruaOrig && r.ruaNova && r.ruaOrig !== r.ruaNova;
        return `<tr style="${rbg?'background:'+rbg+';':''}">
          <td><strong>${escapeHtml(r.codprod)}</strong></td>
          <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
          <td><span style="background:${bg};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">${r.urgencia}</span></td>
          <td>${r.capIni!=null?r.capIni:'—'}</td>
          <td>${r.capNova!=null?r.capNova:'—'}</td>
          <td style="font-weight:700;color:${diffColor}">${r.diff!=null?r.diff:'—'}</td>
          <td style="font-size:11px;font-weight:600;color:${r.pkMudou?'#d64545':'#7a8798'}">${escapeHtml(r.tipoOrigLabel||r.pkOrig||'—')}</td>
          <td style="font-size:11px;font-weight:600;color:${r.pkMudou?'#1a9c62':'#7a8798'}">${escapeHtml(r.tipoNovaLabel||r.pkNova||'—')}</td>
          <td style="font-weight:${ruaMudou?'700':'400'};color:${ruaMudou?'#d64545':'inherit'}">${escapeHtml(r.ruaOrig||'—')}</td>
          <td style="font-weight:${ruaMudou?'700':'400'};color:${ruaMudou?'#1a9c62':'inherit'}">${escapeHtml(r.ruaNova||'—')}</td>
          <td style="text-align:center">${r.mesmaRua?'<span style="color:#1a9c62;font-size:14px;font-weight:700;">✔</span>':'<span style="color:#d64545;font-size:14px;font-weight:700;">✘</span>'}</td>
          <td style="font-size:11px;">${escapeHtml(r.endOrig||'—')}</td>
          <td style="font-size:11px;">${escapeHtml(r.endNova||'—')}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table></div>`}`;

  // ---- Tabela semanal ----
  const semHTML = `
    <div class="cap-section-title">📅 Análise Semanal</div>
    <div class="cap-table-wrap">
    <table class="cap-table">
      <thead><tr>
        <th>Semana</th><th>Únicos Validados</th><th>Total Validações</th>
        <th>Preventivo</th><th>Corretivo</th><th>Revalidações</th>
        <th>Pendentes</th><th>Cobertura</th><th>Média Diária</th>
      </tr></thead>
      <tbody>
      ${comp.semanasOrdenadas.length===0?`<tr><td colspan="9" style="text-align:center;color:#7a8798;padding:20px;">Sem dados no período</td></tr>`:
        comp.semanasOrdenadas.map(s=>`<tr>
          <td>${s.semana}</td>
          <td>${fN(s.unicos)}</td>
          <td>${fN(s.total)}</td>
          <td>${fN(s.prev)}</td>
          <td>${fN(s.corr)}</td>
          <td>${fN(s.revalidacoes)}</td>
          <td>${fN(s.pendentes)}</td>
          <td><span style="color:${s.cobertura>=100?'#1a9c62':s.cobertura>=70?'#1a4480':'#e07b00'};font-weight:700;">${fP(s.cobertura)}</span></td>
          <td>${s.mediaDiaria>0?s.mediaDiaria.toFixed(1):'—'}</td>
        </tr>`).join('')
      }
      </tbody>
    </table>
    </div>
    <!-- TOGGLE ABAIXO DA ANÁLISE SEMANAL -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;padding-top:8px;border-top:1px solid #e2e8f0;">
      <button id="cap-sem-toggle-btn" onclick="capToggleSemanal()"
        style="padding:6px 16px;font-size:12px;font-weight:700;border-radius:6px;
               border:1.5px solid #1a4480;background:#fff;color:#1a4480;
               cursor:pointer;display:flex;align-items:center;gap:6px;">
        <span id="cap-sem-icon">${CapCDState.semAberto?'▼':'▶'}</span>
        <span id="cap-sem-label">${CapCDState.semAberto?'Ocultar tabelas abaixo':'Mostrar tabelas abaixo'}</span>
      </button>
      <span style="font-size:11px;color:#7a8798;">Rankings, validações, pendentes e demanda · ocultos por padrão</span>
    </div>`;

  // ---- Ranking ----
  const rankTotal = comp.ranking.length;
  const rankStart = CapCDState.rankPage * CapCDState.rankPageSize;
  const rankSlice = comp.ranking.slice(rankStart, rankStart + CapCDState.rankPageSize);
  const rankPages = Math.ceil(rankTotal / CapCDState.rankPageSize);
  const rankHTML = `
    <div class="cap-section-title">🏆 Ranking — Produtos com Mais Validações</div>
    <div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>#</th>
        <th>CODPROD</th>
        <th>Descrição</th>
        <th>Total</th>
        <th>Preventivo</th>
        <th>Corretivo</th>
        <th>Revalidações</th>
        <th>Última Validação</th>
      </tr></thead>
      <tbody>
      ${rankSlice.length===0?`<tr><td colspan="8" style="text-align:center;color:#7a8798;padding:20px;">Sem dados</td></tr>`:
        rankSlice.map((r,i)=>`<tr>
          <td style="font-weight:700;color:#7a8798;">${rankStart+i+1}</td>
          <td><strong>${escapeHtml(r.cod)}</strong></td>
          <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
          <td><span style="font-weight:700;color:#1a4480;">${fN(r.total)}</span></td>
          <td>${fN(r.prev)}</td><td>${fN(r.corr)}</td>
          <td>${fN(r.revalidacoes)}</td>
          <td>${fDt(r.ultima)}</td>
        </tr>`).join('')
      }
      </tbody>
    </table>
    </div>
    ${rankPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.rankPage=Math.max(0,CapCDState.rankPage-1);renderCapacidadeCD();" ${CapCDState.rankPage===0?'disabled':''}>◀</button>
      <span>${CapCDState.rankPage+1} / ${rankPages}</span>
      <button onclick="CapCDState.rankPage=Math.min(${rankPages-1},CapCDState.rankPage+1);renderCapacidadeCD();" ${CapCDState.rankPage===rankPages-1?'disabled':''}>▶</button>
    </div>`:''}`;

  // ---- Tabela detalhada de validações ----
  const detSorted = [...comp.tblDetalhada].sort((a,b)=>{
    if(a.diff===null&&b.diff===null) return 0;
    if(a.diff===null) return 1; if(b.diff===null) return -1;
    return Math.abs(b.diff)-Math.abs(a.diff);
  });
  const detTotal = detSorted.length;
  const detStart = CapCDState.detPage * CapCDState.detPageSize;
  const detSlice = detSorted.slice(detStart, detStart + CapCDState.detPageSize);
  const detPages = Math.ceil(detTotal / CapCDState.detPageSize);
  const detHTML = `
    <!-- TOGGLE DETALHAMENTO -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;padding-top:8px;border-top:1px solid #e2e8f0;">
      <button id="cap-det-toggle-btn" onclick="capToggleDetalhamento()"
        style="padding:6px 16px;font-size:12px;font-weight:700;border-radius:6px;
               border:1.5px solid #1a4480;background:#fff;color:#1a4480;
               cursor:pointer;display:flex;align-items:center;gap:6px;">
        <span id="cap-det-icon">${CapCDState.detAberto?'▼':'▶'}</span>
        <span id="cap-det-label">${CapCDState.detAberto?'Ocultar Detalhamento':'Mostrar Detalhamento'}</span>
      </button>
      <span style="font-size:11px;color:#7a8798;">📋 Tabela Detalhada de Validações · ${fN(detTotal)} ocorrências · oculta por padrão</span>
    </div>
    <!-- CONTEÚDO (oculto por padrão) -->
    <div id="cap-det-wrap" style="display:${CapCDState.detAberto?'block':'none'};">
    ${rankHTML}
    ${entradosHTML}
    ${saidosHTML}
    <div class="cap-section-title">📋 Tabela Detalhada de Validações <span style="font-size:12px;font-weight:400;color:#7a8798;">(${fN(detTotal)} ocorrências)</span></div>
    <div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>CODPROD</th>
        <th>Descrição</th>
        <th>Cap. Inicial</th>
        <th>Cap. Atual</th>
        <th>Diferença</th>
        <th>Status Ajuste</th>
        <th>Tipo</th>
        <th>Data</th>
        <th>RUA</th>
        <th>PRÉDIO</th>
        <th>APTO</th>
      </tr></thead>
      <tbody>
      ${detSlice.length===0?`<tr><td colspan="11" style="text-align:center;color:#7a8798;padding:20px;">Sem dados no período</td></tr>`:
        detSlice.map(r=>`<tr>
          <td><strong>${escapeHtml(r.codprod)}</strong></td>
          <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
          <td>${r.capIni!=null?fN(r.capIni):'—'}</td>
          <td>${r.capAtual!=null?fN(r.capAtual):'—'}</td>
          <td style="font-weight:700;color:${r.diff==null?'#7a8798':r.diff>0?'#1a9c62':r.diff<0?'#d64545':'#7a8798'}">${fDiff(r.diff)}</td>
          <td>${badgeAjuste(r.status)}</td>
          <td><span style="background:${r.tipo==='PREVENTIVO'?'#e6f9f0':'#fdf0f0'};color:${r.tipo==='PREVENTIVO'?'#1a9c62':'#d64545'};font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;">${escapeHtml(r.tipo)}</span></td>
          <td>${fDt(r.dt)}</td>
          <td>${escapeHtml(r.rua)}</td><td>${escapeHtml(r.predio)}</td><td>${escapeHtml(r.apto)}</td>
        </tr>`).join('')
      }
      </tbody>
    </table>
    </div>
    ${detPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.detPage=Math.max(0,CapCDState.detPage-1);renderCapacidadeCD();" ${CapCDState.detPage===0?'disabled':''}>◀</button>
      <span>${CapCDState.detPage+1} / ${detPages}</span>
      <button onclick="CapCDState.detPage=Math.min(${detPages-1},CapCDState.detPage+1);renderCapacidadeCD();" ${CapCDState.detPage===detPages-1?'disabled':''}>▶</button>
    </div>`:''}
    </div><!-- /cap-det-wrap -->`;

  // ---- Tabela principal 8022 — somente NÃO VALIDADOS ----
  // Filtra apenas itens não validados da 8022 Nova (ou 8022 se não há Nova)
  const _srcTbl = comp.rows8022N && comp.rows8022N.length ? comp.rows8022N : comp.rows8022;
  const _naoValidados = _srcTbl.filter(r => !comp.uniqueValidadosPorCod.has(r.codprod));
  const sortedRows = [..._naoValidados].sort((a,b)=>{
    const ruaA = a.rua||'', ruaB = b.rua||'';
    if(ruaA!==ruaB) return ruaA.localeCompare(ruaB,undefined,{numeric:true});
    const prA = a.predio||'', prB = b.predio||'';
    if(prA!==prB) return prA.localeCompare(prB,undefined,{numeric:true});
    const nvA = a.nivel||'', nvB = b.nivel||'';
    if(nvA!==nvB) return nvA.localeCompare(nvB,undefined,{numeric:true});
    return (a.apto||'').localeCompare(b.apto||'',undefined,{numeric:true});
  });

  const COLS_ALL = ['codprod','descricao','codauxiliar2','codauxiliar','lastropal','alturapal','qttotpal','codfornec','fornecedor','revenda','capacidade','pontoreposicao','pkestru','pk_end','codendereco','rua','predio','nivel','apto','caracteristica','pulmao','tipo_1'];
  const COLS_SHORT = ['codprod','descricao','capacidade','pontoreposicao','rua','predio','apto'];
  const HEADERS = {codprod:'CODPROD',descricao:'DESCRIÇÃO',codauxiliar2:'COD.AUX2',codauxiliar:'COD.AUX',lastropal:'LASTROPAL',alturapal:'ALTURAPAL',qttotpal:'QTTOTPAL',codfornec:'CODFORNEC',fornecedor:'FORNECEDOR',revenda:'REVENDA',capacidade:'CAPACIDADE',pontoreposicao:'P.REPOS.',pkestru:'PKESTRU',pk_end:'PK_END',codendereco:'CODENDERECO',rua:'RUA',predio:'PRÉDIO',nivel:'NÍVEL',apto:'APTO',caracteristica:'CARACT.',pulmao:'PULMÃO',tipo_1:'TIPO_1'};

  const activeCols = CapCDState.mostrarDetalhes ? COLS_ALL : COLS_SHORT;

  const tblTotal = sortedRows.length;
  const tblStart = CapCDState.tblPage * CapCDState.tblPageSize;
  const tblSlice = sortedRows.slice(tblStart, tblStart + CapCDState.tblPageSize);
  const tblPages = Math.ceil(tblTotal / CapCDState.tblPageSize);

  const tblHTML = `
    <div class="cap-section-title">📦 Tabela Principal — Produtos Não Validados
      <span style="font-size:12px;font-weight:400;color:#7a8798;">(${fN(tblTotal)} pendentes)</span>
    </div>
    <div class="cap-controls-row">
      <label class="cap-toggle-label">Mostrar detalhes:</label>
      <div class="cap-toggle-group">
        <button onclick="CapCDState.mostrarDetalhes=true;CapCDState.tblPage=0;renderCapacidadeCD();" class="cap-toggle-btn ${CapCDState.mostrarDetalhes?'active':''}">Sim</button>
        <button onclick="CapCDState.mostrarDetalhes=false;CapCDState.tblPage=0;renderCapacidadeCD();" class="cap-toggle-btn ${!CapCDState.mostrarDetalhes?'active':''}">Não</button>
      </div>
      <button class="cap-btn-pdf" onclick="capExportPDF()">Extrair PDF (8022)</button>
    </div>
    ${tblTotal===0 ? `<div class="cap-aviso-inline" style="background:#e6f9f0;border-color:#1a9c62;color:#1a9c62;">✅ Todos os itens estão validados!</div>` : `
    <div class="cap-table-wrap" id="cap-main-table-wrap">
    <table class="cap-table" id="cap-main-table">
      <thead><tr>${activeCols.map(c=>`<th>${HEADERS[c]}</th>`).join('')}</tr></thead>
      <tbody>
      ${tblSlice.map(r=>`<tr>${activeCols.map(c=>`<td>${escapeHtml(String(r[c]??''))}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
    </div>
    ${tblPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.tblPage=Math.max(0,CapCDState.tblPage-1);renderCapacidadeCD();" ${CapCDState.tblPage===0?'disabled':''}>◀</button>
      <span>${CapCDState.tblPage+1} / ${tblPages}</span>
      <button onclick="CapCDState.tblPage=Math.min(${tblPages-1},CapCDState.tblPage+1);renderCapacidadeCD();" ${CapCDState.tblPage===tblPages-1?'disabled':''}>▶</button>
    </div>`:''}`}`;

  // ---- Demanda Gerada ----
  const demandaHTML = (() => {
    if (!CapCDState.demandaGerada) return '';
    const lista = CapCDState.demandaGerada;
    const total = lista.length;

    // — Resumo por origem —
    const origemCount = {};
    lista.forEach(r => {
      [...r.origens].forEach(o => { origemCount[o] = (origemCount[o]||0)+1; });
    });
    const origemCores = {
      'Não Validado': '#e07b00',
      'Corretivo Ocorrência': '#d64545',
      'Transferido Preventivo': '#1a9c62',
    };

    // — Resumo por rua —
    const ruaCount = {};
    lista.forEach(r => { const k = r.rua||'(sem rua)'; ruaCount[k]=(ruaCount[k]||0)+1; });
    const ruasOrdenadas = Object.entries(ruaCount).sort((a,b) => a[0].localeCompare(b[0], undefined, {numeric:true}));

    const origemBadge = origens => [...origens].map(o => {
      const clr = origemCores[o]||'#374151';
      return `<span style="background:${clr}20;color:${clr};font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;border:1px solid ${clr}40;margin:1px;">${o}</span>`;
    }).join('');

    const dStart = CapCDState.demandaPage * CapCDState.demandaPageSize;
    const dSlice = lista.slice(dStart, dStart + CapCDState.demandaPageSize);
    const dPages = Math.ceil(total / CapCDState.demandaPageSize);

    // Codigos todos para copiar (JSON array para usar no onclick sem quebrar)
    const codsList = lista.map(r => r.codprod).join('\n');

    return `
    <div class="cap-section-title" style="color:#1a4480;">⚡ Demanda Gerada
      <span style="font-size:12px;font-weight:400;color:#7a8798;">(${fN(total)} itens únicos)</span>
      <button onclick="capCopiarCodigos();" style="margin-left:12px;padding:4px 12px;border-radius:6px;border:1.5px solid #1a4480;background:#fff;color:#1a4480;font-size:11px;font-weight:700;cursor:pointer;">Copiar Códigos</button>
    </div>

    <!-- Resumo por origem -->
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;">
      ${Object.entries(origemCount).map(([orig, cnt]) => {
        const clr = origemCores[orig]||'#374151';
        return `<div style="background:${clr}14;border:1.5px solid ${clr}40;border-radius:10px;padding:10px 18px;min-width:160px;">
          <div style="font-size:11px;font-weight:700;color:${clr};text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">${orig}</div>
          <div style="font-size:22px;font-weight:800;color:${clr};">${fN(cnt)}</div>
          <div style="font-size:10px;color:#7a8798;">itens nesta origem</div>
        </div>`;
      }).join('')}
      <div style="background:#f0f6ff;border:1.5px solid #b3ccf5;border-radius:10px;padding:10px 18px;min-width:160px;">
        <div style="font-size:11px;font-weight:700;color:#1a4480;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Total Único</div>
        <div style="font-size:22px;font-weight:800;color:#1a4480;">${fN(total)}</div>
        <div style="font-size:10px;color:#7a8798;">produtos na demanda</div>
      </div>
    </div>

    <!-- Resumo por rua -->
    ${ruasOrdenadas.length > 0 ? `
    <div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">Itens por Rua</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${ruasOrdenadas.map(([rua, cnt]) => `
          <div style="background:#f5f8fc;border:1px solid #dce5ef;border-radius:8px;padding:6px 12px;text-align:center;min-width:70px;">
            <div style="font-size:10px;color:#7a8798;font-weight:600;">RUA ${escapeHtml(rua)}</div>
            <div style="font-size:17px;font-weight:800;color:#1a2e44;">${fN(cnt)}</div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>#</th><th>CODPROD</th><th>Descrição</th><th>Origem da Demanda</th>
        <th>RUA</th><th>PRÉDIO</th><th>APTO</th><th>Revalid.</th>
      </tr></thead>
      <tbody>
      ${dSlice.map((r,i)=>`<tr style="${r.revalidacao?'background:#fff8ee;':''}">
        <td style="color:#7a8798;font-weight:700;">${dStart+i+1}</td>
        <td><strong>${escapeHtml(r.codprod)}</strong></td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
        <td>${origemBadge(r.origens)}</td>
        <td>${escapeHtml(r.rua||'—')}</td>
        <td>${escapeHtml(r.predio||'—')}</td>
        <td>${escapeHtml(r.apto||'—')}</td>
        <td style="text-align:center">${r.revalidacao?`<span style="background:#e07b00;color:#fff;font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;">REVALID.${r.contTipo>1?' ('+r.contTipo+'x)':''}</span>`:'—'}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>
    ${dPages>1?`<div class="cap-pag">
      <button onclick="CapCDState.demandaPage=Math.max(0,CapCDState.demandaPage-1);renderCapacidadeCD();" ${CapCDState.demandaPage===0?'disabled':''}>◀</button>
      <span>${CapCDState.demandaPage+1} / ${dPages}</span>
      <button onclick="CapCDState.demandaPage=Math.min(${dPages-1},CapCDState.demandaPage+1);renderCapacidadeCD();" ${CapCDState.demandaPage===dPages-1?'disabled':''}>▶</button>
    </div>`:''}`;
  })();

  // ---- Resumo Sheet Tipo ----
  const resumoTipoHTML = (() => {
    if (!processed.sheetTipoDispo) return '';
    const lista = comp.resumoTipo || [];
    return `
    <div class="cap-section-title">📊 Resumo de Ocorrências — Sheet Tipo
      <span style="font-size:12px;font-weight:400;color:#7a8798;">(${fN(lista.length)} produtos)</span>
    </div>
    ${lista.length===0 ? `<div class="cap-aviso-inline">⚠️ Nenhum produto encontrado na sheet Tipo.</div>` : `
    <div class="cap-table-wrap">
    <table class="cap-table data-table">
      <thead><tr>
        <th>CODPROD</th><th>Descrição</th><th>Transferido?</th>
        <th>End. Anterior</th><th>End. Novo</th>
        <th>Dias Úteis c/ Ocorrência</th><th>Dias Desde Última Ocor.</th>
        <th>Última Validação Cap.</th><th>Qtd Preventivo</th><th>Qtd Corretivo</th>
      </tr></thead>
      <tbody>
      ${lista.map(r=>`<tr>
        <td><strong>${escapeHtml(r.codprod)}</strong></td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.descricao)}</td>
        <td style="text-align:center">${r.transferido?`<span style="background:#fdf0f0;color:#d64545;font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;">Sim</span>`:`<span style="background:#e6f9f0;color:#1a9c62;font-size:10px;font-weight:700;padding:2px 7px;border-radius:8px;">Não</span>`}</td>
        <td style="font-size:11px;color:#7a8798;">${escapeHtml(r.endAnterior||'—')}</td>
        <td style="font-size:11px;">${escapeHtml(r.endNovo||'—')}</td>
        <td style="text-align:center;font-weight:700;color:${r.diasComOcorrencia>=4?'#d64545':r.diasComOcorrencia>=2?'#e07b00':'#374151'};">${r.diasComOcorrencia}</td>
        <td style="text-align:center;font-weight:700;color:${r.diasDesdeOcor===null?'#7a8798':r.diasDesdeOcor===0?'#1a9c62':r.diasDesdeOcor>=5?'#d64545':'#e07b00'};">${r.diasDesdeOcor===null?'—':r.diasDesdeOcor+' d.u.'}</td>
        <td>${r.ultimaVal?fDt(r.ultimaVal):'—'}</td>
        <td style="text-align:center;color:#1a9c62;font-weight:700;">${r.qtdPrev}</td>
        <td style="text-align:center;color:#d64545;font-weight:700;">${r.qtdCorr}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>`}`;
  })();

  // ---- Monta HTML final ----
  pane.innerHTML = `
    <div class="panel-section cap-root">
      <div class="panel-header" style="margin-bottom:0;">
        <h2 class="panel-title" style="margin:0;">Capacidade CD</h2>
      </div>
      ${filtroHTML}
      ${avisosHTML}
      ${l1}${l2}${l3}
      ${ajHTML}
      <div class="cap-charts-row">
        <div class="cap-chart-box">
          <div class="cap-chart-title">Validações por Dia</div>
          <div style="height:220px;"><canvas id="cap-chart-dia"></canvas></div>
        </div>
        <div class="cap-chart-box">
          <div class="cap-chart-title">Preventivo × Corretivo</div>
          <div style="height:220px;"><canvas id="cap-chart-tipo"></canvas></div>
        </div>
        <div class="cap-chart-box">
          <div class="cap-chart-title">Cobertura Semanal (%)</div>
          <div style="height:220px;"><canvas id="cap-chart-semanal"></canvas></div>
        </div>
      </div>
      <div class="cap-chart-box" style="margin:16px 0;">
        <div class="cap-chart-title">📊 Cobertura por Rua — Validados × Total (8022 Nova)</div>
        <div style="height:300px;overflow:hidden;position:relative;"><canvas id="cap-chart-rua"></canvas></div>
      </div>
      ${(() => {
        if (!CapCDState.demandaGerada) return '';
        const lista = CapCDState.demandaGerada;
        const total = lista.length;
        const origemCores = {'Não Validado':'#e07b00','Corretivo Ocorrência':'#d64545','Transferido Preventivo':'#1a9c62'};
        const origemCount = {};
        lista.forEach(r => { [...r.origens].forEach(o => { origemCount[o]=(origemCount[o]||0)+1; }); });
        const ruaCount = {};
        lista.forEach(r => { const k=r.rua||'(sem rua)'; ruaCount[k]=(ruaCount[k]||0)+1; });
        const ruasOrdenadas = Object.entries(ruaCount).sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true}));
        return `
        <div style="background:#f0f6ff;border:1.5px solid #b3ccf5;border-radius:12px;padding:18px 20px;margin:0 0 16px 0;">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
            <div style="font-size:14px;font-weight:700;color:#1a4480;">⚡ Resumo da Demanda do Dia</div>
            <button onclick="capCopiarCodigos();" style="padding:5px 14px;border-radius:6px;border:1.5px solid #1a4480;background:#fff;color:#1a4480;font-size:11px;font-weight:700;cursor:pointer;">Copiar ${fN(total)} Códigos</button>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
            ${Object.entries(origemCount).map(([orig,cnt])=>{
              const clr=origemCores[orig]||'#374151';
              return `<div style="background:${clr}12;border:1.5px solid ${clr}40;border-radius:10px;padding:10px 16px;min-width:150px;">
                <div style="font-size:10px;font-weight:700;color:${clr};text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">${orig}</div>
                <div style="font-size:22px;font-weight:800;color:${clr};">${fN(cnt)}</div>
                <div style="font-size:10px;color:#7a8798;">itens</div>
              </div>`;
            }).join('')}
            <div style="background:#fff;border:1.5px solid #b3ccf5;border-radius:10px;padding:10px 16px;min-width:120px;">
              <div style="font-size:10px;font-weight:700;color:#1a4480;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Total Único</div>
              <div style="font-size:22px;font-weight:800;color:#1a4480;">${fN(total)}</div>
              <div style="font-size:10px;color:#7a8798;">produtos</div>
            </div>
          </div>
          ${ruasOrdenadas.length>0?`
          <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px;">Itens por Rua</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${ruasOrdenadas.map(([rua,cnt])=>`
              <div style="background:#fff;border:1px solid #dce5ef;border-radius:8px;padding:5px 10px;text-align:center;min-width:64px;">
                <div style="font-size:9px;color:#7a8798;font-weight:600;">RUA ${escapeHtml(rua)}</div>
                <div style="font-size:16px;font-weight:800;color:#1a2e44;">${fN(cnt)}</div>
              </div>`).join('')}
          </div>`:''}
        </div>`;
      })()}
      ${previsaoHTML}
      ${transferidosHTML}
      ${ultimoValHTML}
      ${semHTML}
      <div id="cap-sem-wrap" style="display:${CapCDState.semAberto?'block':'none'};">
      ${tblHTML}
      ${detHTML}
      ${demandaHTML}
      ${resumoTipoHTML}
      </div><!-- /cap-sem-wrap -->
    </div>`;

  // ---- Renderiza gráficos e ativa sort ----
  requestAnimationFrame(() => { capRenderCharts(comp); capActivateSortable(); });
}

/* ---- Ativa sortable em tabelas cap após render ---- */
function capActivateSortable() {
  document.querySelectorAll('table.cap-table.data-table').forEach(makeSortable);
}

function capRenderCharts(comp) {
  if (typeof Chart === 'undefined') return;

  // Cores padrão: Preventivo = azul pastel claro, Corretivo = azul médio profundo
  const COR_PREV = '#A8C8FF';
  const COR_CORR = '#2563CC';

  // Gráfico 1: Barras empilhadas por dia
  const ctx1 = document.getElementById('cap-chart-dia');
  if (ctx1) {
    const dias = comp.diasOrdenados;
    CapCDState.charts['dia'] = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: dias.map(([,d])=>d.label),
        datasets: [
          {
            label:'Preventivo', data: dias.map(([,d])=>d.prev),
            backgroundColor: COR_PREV, stack:'s',
            datalabels: { color:'#000000', font:{weight:'bold',size:9}, anchor:'center', align:'center',
              formatter: v => v > 0 ? v : '' }
          },
          {
            label:'Corretivo', data: dias.map(([,d])=>d.corr),
            backgroundColor: COR_CORR, stack:'s',
            datalabels: { color:'#ffffff', font:{weight:'bold',size:9}, anchor:'center', align:'center',
              formatter: v => v > 0 ? v : '' }
          },
        ]
      },
      options: { responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{display:true,position:'top',labels:{font:{size:10},color:'#3a4a5c'}},
          tooltip:{callbacks:{title:ctx=>ctx[0].label}},
          datalabels: { display: true }
        },
        scales:{ x:{ticks:{color:'#7a8798',font:{size:9}},grid:{color:'#eef1f4'},stacked:true},
          y:{ticks:{color:'#7a8798',font:{size:9}},beginAtZero:true,stacked:true,grid:{color:'#eef1f4'}} } }
    });
  }

  // Gráfico 2: Doughnut Preventivo × Corretivo
  const ctx2 = document.getElementById('cap-chart-tipo');
  if (ctx2) {
    CapCDState.charts['tipo'] = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Preventivo','Corretivo'],
        datasets: [{
          data:[comp.totalPreventivo, comp.totalCorretivo],
          backgroundColor:[COR_PREV, COR_CORR],
          borderColor:['#7AADFF','#1A4AB0'],
          borderWidth:2
        }]
      },
      options: { responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{display:true,position:'bottom',labels:{font:{size:10},color:'#3a4a5c'}},
          tooltip:{callbacks:{label:ctx=>`${ctx.label}: ${ctx.parsed} (${comp.totalValidacoes>0?(ctx.parsed/comp.totalValidacoes*100).toFixed(1)+'%':'—'})`}},
          datalabels: {
            color: ctx => ctx.dataIndex===0 ? '#000000' : '#ffffff',
            font:{weight:'bold',size:11},
            formatter: (v, ctx2) => {
              const total = ctx2.dataset.data.reduce((a,b)=>a+b,0);
              return total > 0 ? v+'\n'+(v/total*100).toFixed(0)+'%' : '';
            }
          }
        }
      }
    });
  }

  // Gráfico 3: Linha de cobertura semanal
  const ctx3 = document.getElementById('cap-chart-semanal');
  if (ctx3) {
    CapCDState.charts['semanal'] = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: comp.semanasOrdenadas.map(s=>s.semana),
        datasets: [{
          label:'Cobertura (%)', data: comp.semanasOrdenadas.map(s=>parseFloat(s.cobertura.toFixed(1))),
          borderColor:'#1a4480', backgroundColor:'#1a448020', fill:true, tension:0.3, pointRadius:4
        }]
      },
      options: { responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false} },
        scales:{ x:{ticks:{color:'#7a8798',font:{size:9}},grid:{color:'#eef1f4'}},
          y:{ticks:{color:'#7a8798',font:{size:9},callback:v=>v+'%'},beginAtZero:true,max:100,grid:{color:'#eef1f4'}} } }
    });
  }

  // Gráfico 4: Cobertura por Rua — barra empilhada 0–100% por rua
  const ctx4 = document.getElementById('cap-chart-rua');
  if (ctx4 && comp.rows8022N && comp.uniqueValidadosPorCod) {
    // Monta mapa: rua → { total, valid }
    const ruaMap = new Map();
    (comp.rows8022N || []).forEach(r => {
      const rua = String(r.rua||'?').trim();
      if(!ruaMap.has(rua)) ruaMap.set(rua,{total:0,valid:0});
      ruaMap.get(rua).total++;
      if(comp.uniqueValidadosPorCod.has(r.codprod)) ruaMap.get(rua).valid++;
    });
    const ruasSorted = [...ruaMap.entries()].sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true}));
    // Label: apenas o número da rua (sem "Rua ")
    const labels4   = ruasSorted.map(([rua]) => rua);
    // Converte para percentual: validado% e restante%
    const pctValid  = ruasSorted.map(([,v])=> v.total>0 ? Math.round(v.valid/v.total*100) : 0);
    const pctRest   = pctValid.map(p => 100 - p);
    // Armazena totais para tooltip — chave = número puro da rua
    const totaisMap = new Map(ruasSorted.map(([rua,v])=>[rua, v]));

    // Paleta igual ao gráfico Preventivo×Corretivo: escuro=validado, claro=pendente
    const COR_VALID = '#2563CC'; // escuro — mesmo COR_CORR
    const COR_PEND  = '#A8C8FF'; // claro — mesmo COR_PREV

    // Canvas responsivo: ocupa toda a largura do container, altura generosa
    // Sem expansão horizontal — todas as ruas cabem na área visível
    const wrap = ctx4.parentElement;
    const wrapW = wrap.offsetWidth || 700;
    ctx4.style.width  = wrapW + 'px';
    ctx4.width        = wrapW;
    ctx4.style.height = '300px';

    CapCDState.charts['rua'] = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: labels4,
        datasets: [
          {
            label: 'Validado (%)',
            data: pctValid,
            backgroundColor: COR_VALID,
            borderColor: COR_VALID,
            borderWidth: 0,
            stack: 'rua',
            datalabels: {
              display: ctx => pctValid[ctx.dataIndex] >= 12,
              color: '#ffffff',
              font: { weight: 'bold', size: 9 },
              anchor: 'center',
              align: 'center',
              rotation: -90,           // vertical
              formatter: v => v + '%'
            }
          },
          {
            label: 'Pendente (%)',
            data: pctRest,
            backgroundColor: COR_PEND,
            borderColor: COR_PEND,
            borderWidth: 0,
            stack: 'rua',
            datalabels: {
              display: ctx => pctRest[ctx.dataIndex] >= 16,
              color: '#000000',
              font: { weight: 'bold', size: 9 },
              anchor: 'center',
              align: 'center',
              rotation: -90,           // vertical
              formatter: (v, ctx) => {
                const entry = totaisMap.get(labels4[ctx.dataIndex]) || {total:0,valid:0};
                const pend = entry.total - entry.valid;
                return pend > 0 ? pend + 'p' : '';
              }
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, position: 'top',
            labels: { font:{ size:11 }, color:'#3a4a5c',
              generateLabels: () => [
                { text:'Validado (%)', fillStyle: COR_VALID, strokeStyle: COR_VALID, lineWidth:0 },
                { text:'Pendente (%)', fillStyle: COR_PEND,  strokeStyle: COR_PEND,  lineWidth:0 }
              ]
            }
          },
          datalabels: {},
          tooltip: {
            callbacks: {
              title: items => 'Rua ' + items[0].label,
              label: ctx => {
                const entry = totaisMap.get(ctx.label) || {total:0,valid:0};
                const pct   = entry.total > 0 ? Math.round(entry.valid/entry.total*100) : 0;
                return [
                  `Total na rua: ${entry.total} itens`,
                  `Validados:    ${entry.valid} (${pct}%)`,
                  `Pendentes:    ${entry.total - entry.valid} (${100-pct}%)`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: '#7a8798',
              font: { size: 9, weight: '600' },
              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,       // nunca pular rótulos
            },
            grid: { display: false },
            barPercentage: 0.85,
            categoryPercentage: 0.9
          },
          y: {
            stacked: true,
            min: 0, max: 100,
            ticks: { color:'#7a8798', font:{ size:9 }, callback: v => v + '%' },
            grid: { color:'#eef1f4' }
          }
        }
      }
    });
  }
}

/* ---- EXPORTAÇÃO PDF ---- */
function capExportPDF() {
  const processed = window.APP_STATE && window.APP_STATE.processed ? window.APP_STATE.processed : null;
  if (!processed || !processed.p8022CDRows) { toast('Sem dados para exportar.','error'); return; }

  if (typeof window.jspdf === 'undefined') { toast('jsPDF não disponível.','error'); return; }

  const rows = [...(processed.p8022CDRows||[])].sort((a,b)=>{
    const ruaA = a.rua||'', ruaB = b.rua||'';
    if(ruaA!==ruaB) return ruaA.localeCompare(ruaB,undefined,{numeric:true});
    const prA = a.predio||'', prB = b.predio||'';
    if(prA!==prB) return prA.localeCompare(prB,undefined,{numeric:true});
    const nvA = a.nivel||'', nvB = b.nivel||'';
    if(nvA!==nvB) return nvA.localeCompare(nvB,undefined,{numeric:true});
    return (a.apto||'').localeCompare(b.apto||'',undefined,{numeric:true});
  });

  const COLS_ALL  = ['codprod','descricao','codauxiliar2','codauxiliar','lastropal','alturapal','qttotpal','codfornec','fornecedor','revenda','capacidade','pontoreposicao','pkestru','pk_end','codendereco','rua','predio','nivel','apto','caracteristica','pulmao','tipo_1'];
  const COLS_SHORT= ['codprod','descricao','capacidade','pontoreposicao','rua','predio','apto'];
  const HEADERS   = {codprod:'CODPROD',descricao:'DESCRIÇÃO',codauxiliar2:'COD.AUX2',codauxiliar:'COD.AUX',lastropal:'LASTROPAL',alturapal:'ALTURAPAL',qttotpal:'QTTOTPAL',codfornec:'CODFORNEC',fornecedor:'FORNECEDOR',revenda:'REVENDA',capacidade:'CAPACIDADE',pontoreposicao:'P.REPOS.',pkestru:'PKESTRU',pk_end:'PK_END',codendereco:'CODENDERECO',rua:'RUA',predio:'PRÉDIO',nivel:'NÍVEL',apto:'APTO',caracteristica:'CARACT.',pulmao:'PULMÃO',tipo_1:'TIPO_1'};

  const activeCols = CapCDState.mostrarDetalhes ? COLS_ALL : COLS_SHORT;

  // Agrupa por RUA
  const ruaMap = new Map();
  rows.forEach(r => {
    const rua = r.rua || '(sem rua)';
    if(!ruaMap.has(rua)) ruaMap.set(rua, []);
    ruaMap.get(rua).push(r);
  });

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit:'pt', format:'a4', putOnlyUsedFonts:true });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 30;
    const colW = Math.floor((pageW - margin*2) / activeCols.length);
    const rowH = 14, headerH = 18;
    let y = margin;
    let firstRua = true;

    const addHeader = (rua) => {
      doc.setFillColor(26,68,128); doc.rect(margin, y, pageW-margin*2, headerH, 'F');
      doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont('helvetica','bold');
      doc.text(`RUA ${rua} — Capacidade CD`, margin+6, y+12);
      y += headerH + 4;
      // Cabeçalho das colunas
      doc.setFillColor(240,244,250); doc.rect(margin, y, pageW-margin*2, rowH, 'F');
      doc.setTextColor(26,68,128); doc.setFontSize(7); doc.setFont('helvetica','bold');
      activeCols.forEach((c,i) => {
        doc.text(String(HEADERS[c]||c).substring(0,12), margin+i*colW+2, y+9, {maxWidth:colW-4});
      });
      y += rowH;
      doc.setFont('helvetica','normal'); doc.setTextColor(40,40,40);
    };

    [...ruaMap.entries()].sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true})).forEach(([rua, ruaRows]) => {
      if(!firstRua) { doc.addPage(); y = margin; }
      firstRua = false;
      addHeader(rua);
      doc.setFontSize(7);
      ruaRows.forEach((r, ri) => {
        if(y + rowH > pageH - margin) {
          doc.addPage(); y = margin;
          addHeader(rua + ' (cont.)');
          doc.setFontSize(7);
        }
        if(ri%2===0) { doc.setFillColor(248,250,253); doc.rect(margin, y, pageW-margin*2, rowH, 'F'); }
        doc.setTextColor(40,40,40);
        activeCols.forEach((c,i) => {
          const val = String(r[c]??'').substring(0,18);
          doc.text(val, margin+i*colW+2, y+9, {maxWidth:colW-4});
        });
        y += rowH;
      });
    });

    doc.save('Capacidade_CD.pdf');
    toast('PDF gerado com sucesso!', 'success');
  } catch(err) {
    console.error('capExportPDF erro:', err);
    toast('Erro ao gerar PDF: '+err.message, 'error');
  }
}

/* ---------------------------------------------------------------------- */
/* MODULE: Organograma (Gestão)                                            */
/* Cadeia fixa + equipe do QUADRO REP atual; demais setores vêm do         */
/* ORGANOGRAMA.xlsx (aba Base), carregado pelo usuário e guardado só no    */
/* navegador (localStorage) — os dados de pessoal não ficam no repositório.*/
/* ---------------------------------------------------------------------- */
const ORG_LIDERANCA = [
  { nome:"Alexandre Alencar", cargo:"Gerente",             cls:"top" },
  { nome:"Amaury Kairo",      cargo:"Sub Gerente",         cls:"mid" },
  { nome:"Fabio Nyckolas",    cargo:"Líder de Operações",  cls:"me"  }
];
const ORG_STORE = "orgBaseRows_v1";
const ORG_ULTIMOS = ["TRANSFERIR MATRIZ","AFASTADOS","FALTANTES"];
const OrgState = { rows:null, fonte:"", outros:false };

function orgTitle(s){
  const small = new Set(["DE","DA","DO","DAS","DOS","E","EM"]);
  return trimStr(s).replace(/\s+/g," ").toLowerCase().split(" ").map((w,i)=>
    (i>0 && small.has(w.toUpperCase())) ? w : w.charAt(0).toUpperCase()+w.slice(1)).join(" ");
}
function orgParse(wb){
  const nm = wb.SheetNames.find(n=>normStr(n)==="BASE") || wb.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(wb.Sheets[nm], { header:1, defval:"" }).slice(1);
  // colunas por posição: A Matrícula, B Nome, C Função, D Setor, E Encarregado, F Sub-setor
  const out = [];
  data.forEach(r=>{
    const nome = trimStr(r[1]); if(!nome) return;
    const setor = trimStr(r[3]) || "Sem setor", enc = trimStr(r[4]), sub = trimStr(r[5]);
    const sk = normStr(setor), ek = normStr(enc), bk = normStr(sub);
    out.push({
      mat: trimStr(r[0]), nome: orgTitle(nome), func: orgTitle(r[2]),
      setor: orgTitle(setor), sk,
      enc: (!ek || ek===sk) ? "" : orgTitle(enc), ek: (!ek || ek===sk) ? "" : ek,
      sub: (!bk || bk===sk) ? "" : orgTitle(sub), bk: (!bk || bk===sk) ? "" : bk
    });
  });
  if(!out.length) throw new Error("Nenhum colaborador encontrado na planilha.");
  return out;
}
function orgRestore(){
  if(OrgState.rows) return;
  try{
    const j = JSON.parse(localStorage.getItem(ORG_STORE)||"null");
    if(j && Array.isArray(j.rows) && j.rows.length){ OrgState.rows = j.rows; OrgState.fonte = j.fonte||""; }
  }catch(e){}
}
function orgLoadFile(input){
  const f = input.files && input.files[0]; if(!f) return;
  const fr = new FileReader();
  fr.onload = ()=>{
    try{
      const wb = XLSX.read(fr.result, { type:"array" });
      OrgState.rows = orgParse(wb); OrgState.fonte = f.name;
      try{ localStorage.setItem(ORG_STORE, JSON.stringify({ rows:OrgState.rows, fonte:f.name })); }catch(e){}
      toast("Organograma geral carregado: "+OrgState.rows.length+" colaboradores.", "success");
      renderOrganograma();
    }catch(err){ toast(err.message || "Não consegui ler esse arquivo.", "error"); }
  };
  fr.onerror = ()=> toast("Não consegui abrir o arquivo.", "error");
  fr.readAsArrayBuffer(f);
  input.value = "";
}
function orgSetOutros(v){ OrgState.outros = !!v; renderOrganograma(); }
function orgLimpar(){
  OrgState.rows = null; OrgState.fonte = ""; OrgState.outros = false;
  try{ localStorage.removeItem(ORG_STORE); }catch(e){}
  renderOrganograma();
}

function orgTeamHtml(){
  const ct = window.APP_STATE.currentTeam, registry = window.APP_STATE.nameRegistry;
  const meuKey = normStr(AVALIADOR_FIXO.codigo);
  const membros = (ct.members||[]).filter(m=>m.codKey!==meuKey).map(m=>({
    nome: orgTitle(registry.get(m.codKey) || m.nome), cargo: ct.cargoDisponivel ? m.cargo : null
  })).sort((a,b)=>a.nome.localeCompare(b.nome,"pt"));
  const grupos = [
    ["LIDER","Líderes"],["AUXILIAR","Auxiliares"],["REPOSITOR","Repositores"],["OUTRO","Outros cargos"],[null,"Equipe"]
  ].map(([k,label])=>({ label, lista: membros.filter(m=>m.cargo===k) })).filter(g=>g.lista.length);
  return `<div class="org-team"><h3>Equipe Reposição · ${membros.length} pessoas</h3>` +
    grupos.map(g=>`<div class="org-group"><div>${g.label} (${g.lista.length})</div><div class="org-people">` +
      g.lista.map(m=>`<div class="org-person">${escapeHtml(m.nome)}</div>`).join("") + `</div></div>`).join("") + `</div>`;
}

function orgOthersHtml(){
  const rows = OrgState.rows;
  if(!rows) return `<div class="org-empty">Para ver os demais setores, carregue o arquivo <strong>ORGANOGRAMA.xlsx</strong> (aba Base) no botão acima. Ele fica salvo só neste navegador.</div>`;
  const meuKey = normStr(AVALIADOR_FIXO.codigo);
  const eu = rows.find(r=>normStr(r.mat)===meuKey);
  const S = new Map();
  rows.forEach(r=>{
    if(r.sk==="GERENCIA GERAL") return;
    if(!S.has(r.sk)) S.set(r.sk, { name:r.setor, key:r.sk, n:0, E:new Map() });
    const s = S.get(r.sk); s.n++;
    if(!s.E.has(r.ek)) s.E.set(r.ek, { name:r.enc, key:r.ek, n:0, B:new Map() });
    const e = s.E.get(r.ek); e.n++;
    if(!e.B.has(r.bk)) e.B.set(r.bk, { name:r.sub, key:r.bk, P:[] });
    e.B.get(r.bk).P.push(r);
  });
  const sets = Array.from(S.values()).sort((a,b)=>{
    const ma = eu && a.key===eu.sk ? 0 : 1, mb = eu && b.key===eu.sk ? 0 : 1;
    if(ma!==mb) return ma-mb;
    const la = ORG_ULTIMOS.indexOf(a.key), lb = ORG_ULTIMOS.indexOf(b.key);
    if((la<0)!==(lb<0)) return la<0 ? -1 : 1;
    return la>=0 ? la-lb : b.n-a.n;
  });
  const cards = sets.map(s=>{
    const mineSet = eu && s.key===eu.sk;
    const encs = Array.from(s.E.values()).sort((a,b)=>b.n-a.n).map(e=>{
      const mineEnc = mineSet && e.key===eu.ek;
      const subs = Array.from(e.B.values()).sort((a,b)=>b.P.length-a.P.length).map(b=>
        `<details${mineEnc?' class="mine" open':''}><summary><span>${escapeHtml(b.name||"Colaboradores")}</span><span>${b.P.length}</span></summary><ul>` +
        b.P.slice().sort((x,y)=>x.nome.localeCompare(y.nome,"pt")).map(p=>
          `<li>${escapeHtml(p.nome)} <em>· ${escapeHtml(p.func||"-")}</em></li>`).join("") + `</ul></details>`).join("");
      return (e.name ? `<div class="org-enc">Encarregado: <strong>${escapeHtml(e.name)}</strong>${mineEnc?" · seu time":""}</div>` : "") + subs;
    }).join("");
    return `<section class="org-sec${mineSet?' mine':''}"><header><span>${escapeHtml(s.name)}</span><span class="cnt">${s.n}</span></header>${encs}</section>`;
  }).join("");
  return `<div class="org-sectors">${cards}</div>`;
}

function renderOrganograma(){
  const pane = $("#pane-organograma"); if(!pane) return;
  orgRestore();
  const ct = window.APP_STATE.currentTeam;
  const chain = ORG_LIDERANCA.map((n,i)=>
    (i?'<div class="org-line"></div>':'') +
    `<div class="org-node ${n.cls}"><b>${escapeHtml(n.nome)}</b><span>${escapeHtml(n.cargo)}</span></div>`).join("");
  const loaded = OrgState.rows ? `<span style="font-size:12px;color:var(--gray-500);">${escapeHtml(OrgState.fonte)} · ${OrgState.rows.length} pessoas</span>` : "";
  pane.innerHTML = `<div class="org-wrap">
    <div class="org-head">
      <div><h2>Organograma · Reposição</h2><small>Quadro atual: ${ct.date?fmtDateBR(ct.date):"-"} · equipe atualizada a partir do QUADRO REP</small></div>
      <div class="org-ctrl">
        <label>Mostrar outros setores?</label>
        <div class="toggle-group">
          <button class="${!OrgState.outros?'active':''}" onclick="orgSetOutros(false)">Não</button>
          <button class="${OrgState.outros?'active':''}" onclick="orgSetOutros(true)">Sim</button>
        </div>
        <label class="btn btn-outline btn-sm" style="margin:0;cursor:pointer;">📂 ${OrgState.rows?'Trocar':'Carregar'} ORGANOGRAMA.xlsx
          <input type="file" accept=".xlsx,.xls" style="display:none" onchange="orgLoadFile(this)"></label>
        ${OrgState.rows?'<button class="btn btn-outline btn-sm" onclick="orgLimpar()">Remover</button>':''}
        ${loaded}
      </div>
    </div>
    <div class="org-chain">${chain}<div class="org-line"></div>${orgTeamHtml()}</div>
    ${OrgState.outros ? `<div class="org-others"><h3>Demais setores da Logística</h3><p>Seu setor aparece primeiro e destacado.</p>${orgOthersHtml()}</div>` : ""}
  </div>`;
}

/* ======================================================================== */
/* MODULE: Nível de Abastecimento do Picking                                 */
/* Qtd Disp dos endereços PK (1707) ÷ QTUNITCX (8022 Nova) = caixas          */
/* caixas ÷ Cap Pick (1707 col. N) = nível de abastecimento                  */
/* ======================================================================== */
// 1707 sem cabeçalho, nesta ordem de colunas:
// A Cod End | B Rua | C Prédio | D Nível | E Apto | F Status | G Cod Prod | H Desc Prod | I Bloq | J Dt Val |
// K Bem | L Lastro | M Camada | N Cap Pick | O Tipo | P Palete Pick | Q Palete End | R Qtd Tot | S Qtd |
// T Pend Entrada | U Pend Saída | V Qtd Disp
const ABAST_COL_END      = 0;   // A
const ABAST_COL_RUA      = 1;   // B
const ABAST_COL_CAP_PICK = 13;  // N  (Cap Pick = capacidade do picking, em caixas)
const ABAST_COL_COD_PROD = 6;   // G
const ABAST_COL_TIPO     = 14;  // O  (AE = aéreo, AP/PK = picking)
const ABAST_COL_QTD_DISP = 21;  // V
const ABAST_NUM_COLS     = 22;
const ABAST_RUA_MAX_REVENDA = 47;   // ruas acima da 47 (coluna B da 1707) são Não Revenda
const ABAST_LIMITE_PADRAO = 5;

const ABAST_FAIXAS = [
  { id:"acima", label:"Acima de 100%", tom:"",     cor:"#2f6fce", corGraf:"#123a6b", test:p=>p>100 },
  { id:"f90",   label:"90% a 100%",    tom:"pos",  cor:"#1a9c62", corGraf:"#1a9c62", test:p=>p>=90 && p<=100 },
  { id:"f50",   label:"50% a 90%",     tom:"",     cor:"#2f6fce", corGraf:"#2f6fce", test:p=>p>=50 && p<90 },
  { id:"f30",   label:"30% a 50%",     tom:"warn", cor:"#e08a1f", corGraf:"#e08a1f", test:p=>p>=30 && p<50 },
  { id:"f10",   label:"10% a 30%",     tom:"neg",  cor:"#d64545", corGraf:"#d64545", test:p=>p>=10 && p<30 },
  { id:"f0",    label:"Menos de 10%",  tom:"neg",  cor:"#d64545", corGraf:"#a63232", test:p=>p<10 }
];
const ABAST_FAIXA_ND = { id:"nd", label:"Sem cálculo", tom:"", cor:"#7a8798", corGraf:"#7a8798" };

const ABAST_RUAS = [
  { id:"r2",    label:"Ruas 2 a 10",  min:2,  max:10 },
  { id:"r11",   label:"Ruas 11 a 20", min:11, max:20 },
  { id:"r21",   label:"Ruas 21 a 30", min:21, max:30 },
  { id:"r31",   label:"Ruas 31 a 40", min:31, max:40 },
  { id:"r41",   label:"Ruas 41 a 50", min:41, max:50 },
  { id:"outras",label:"Outras ruas",  min:null, max:null }
];

const AbastState = {
  faixa:"", rua:"", ruaExata:"", busca:"", mostrarTodos:false, mostrarTodosSaldo:false,
  // todos os toggles começam em "Não"; limite de saldo baixo começa em 5 caixas
  opts: { saldoBaixo:false, naoRevenda:false, excluirSemAE:true, limite:ABAST_LIMITE_PADRAO },
  limiteDigitado: null,   // valor digitado no campo e ainda não aplicado (só vale ao clicar em Buscar)
  comp:null, base:null, cache:null
};

function abastToNum(v){
  if(v==null || v==="") return 0;
  if(typeof v === "number") return isFinite(v) ? v : 0;
  const n = Number(String(v).trim().replace(/\./g,"").replace(",","."));
  return isFinite(n) ? n : 0;
}

function abastFaixaDe(p){
  if(p==null) return ABAST_FAIXA_ND;
  return ABAST_FAIXAS.find(f=>f.test(p)) || ABAST_FAIXA_ND;
}

function abastRuaRange(ruaNum){
  if(ruaNum==null) return ABAST_RUAS[ABAST_RUAS.length-1];
  return ABAST_RUAS.find(r=>r.min!=null && ruaNum>=r.min && ruaNum<=r.max) || ABAST_RUAS[ABAST_RUAS.length-1];
}

// ---------------------------------------------------------------------------
// Base: lê a 1707 e a 8022 Nova uma única vez por arquivo carregado
// (os toggles e o limite de saldo baixo só refiltram, não relêem a planilha)
// ---------------------------------------------------------------------------
function abastBase(processed, raw){
  const c = AbastState.cache;
  if(c && c.raw === raw && c.processed === processed) return c.base;
  const base = abastMontarBase(processed, raw);
  AbastState.cache = { raw, processed, base };
  return base;
}

function abastMontarBase(processed, raw){
  const aoa  = raw && raw["1707__aoa"];
  const nova = processed && processed.p8022Nova;
  if(!aoa)  return { erro:"A aba <strong>1707</strong> não foi encontrada no arquivo carregado." };
  if(!nova) return { erro:"A aba <strong>8022 Nova</strong> não foi encontrada no arquivo carregado." };
  if(!aoa.length) return { erro:"A aba <strong>1707</strong> está vazia." };

  const largura = aoa.slice(0,300).reduce((m,r)=>Math.max(m, r ? r.length : 0), 0);
  if(largura < ABAST_NUM_COLS){
    return { erro:`A aba <strong>1707</strong> tem ${largura} colunas, mas a ordem combinada tem ${ABAST_NUM_COLS} (A a V, terminando em <em>Qtd Disp</em>).` +
      (largura === 21 ? " Isso é o layout antigo do relatório, sem as colunas de tipo AE/PK." : "") +
      " Carregue o arquivo com a 1707 no layout novo." };
  }

  // a 1707 não tem cabeçalho; só pula a 1ª linha se ela for claramente um título
  const q0 = aoa[0] ? aoa[0][ABAST_COL_QTD_DISP] : null;
  const temTitulo = typeof q0 === "string" && q0.trim() !== "" && isNaN(Number(q0.replace(",",".")));
  const linhaInicial = temTitulo ? 1 : 0;

  // 8022 Nova: uma linha por produto (prefere a que tem capacidade e QTUNITCX)
  const score = n => (n.capacidade>0 ? 1 : 0) + (n.qtunitcx>0 ? 1 : 0);
  const novaPorProd = new Map();
  nova.forEach(n=>{
    const a = novaPorProd.get(n.codprod);
    if(!a || score(n) > score(a)) novaPorProd.set(n.codprod, n);
  });

  // 1707: soma Qtd Disp dos endereços PK de cada produto; guarda quais produtos têm endereço AE
  const pkMap = new Map();      // cod → { qtd, n, end }
  const aeSet = new Set();      // cods que aparecem em algum endereço AE
  const tiposVistos = new Map();
  const amostraCod = [];
  let comProduto = 0, casamNova = 0, pkSemCadastro = 0;
  for(let i=linhaInicial; i<aoa.length; i++){
    const row = aoa[i];
    if(!row) continue;
    const cod = row[ABAST_COL_COD_PROD]!=null ? String(row[ABAST_COL_COD_PROD]).trim() : "";
    if(!cod || cod === "0") continue;                 // código 0 = endereço vazio
    comProduto++;
    if(amostraCod.length < 5) amostraCod.push(cod);
    const naNova = novaPorProd.has(cod);
    if(naNova) casamNova++;
    let tipo = normStr(row[ABAST_COL_TIPO]);
    if(tipo === "AP") tipo = "PK";                    // na 1707 o picking vem como AP; aqui tratamos como PK
    tiposVistos.set(tipo, (tiposVistos.get(tipo)||0) + 1);
    if(tipo === "PK"){
      let p = pkMap.get(cod);
      if(!p){ p = { qtd:0, n:0, end: row[ABAST_COL_END], rua: abastToNum(row[ABAST_COL_RUA]) || null, cap:0 }; pkMap.set(cod, p); }
      p.qtd += abastToNum(row[ABAST_COL_QTD_DISP]);
      p.cap += abastToNum(row[ABAST_COL_CAP_PICK]);
      p.n++;
      if(!naNova) pkSemCadastro++;
    } else if(tipo === "AE"){
      aeSet.add(cod);
    }
  }

  // conferências do layout: se a ordem das colunas não bate, avisa em vez de calcular errado
  const tiposTxt = () => Array.from(tiposVistos.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([t,n])=>`<code>${escapeHtml(t||"(vazio)")}</code> (${n})`).join(", ");
  if(!comProduto){
    return { erro:"Não encontrei códigos de produto na coluna <strong>G</strong> (Cod Prod) da aba <strong>1707</strong>. Confira a ordem das colunas." };
  }
  if(!(tiposVistos.get("PK") || tiposVistos.get("AE"))){
    return { erro:`A coluna <strong>O</strong> (Tipo) da aba <strong>1707</strong> não tem valores <code>AE</code> nem <code>AP</code>/<code>PK</code>. Valores encontrados: ${tiposTxt()}. Confira a ordem das colunas.` };
  }
  if(casamNova / comProduto < 0.3){
    return { erro:`Poucos códigos da coluna <strong>G</strong> (Cod Prod) da aba <strong>1707</strong> existem na <strong>8022 Nova</strong> (${abastFN(casamNova,0)} de ${abastFN(comProduto,0)}). Exemplos lidos: ${amostraCod.map(c=>`<code>${escapeHtml(c)}</code>`).join(", ")}. Confira a ordem das colunas.` };
  }

  // um registro por produto da 8022 Nova
  const rows = [];
  let negativos = 0, pkSemQtunitcx = 0;
  novaPorProd.forEach(n=>{
    const pk = pkMap.get(n.codprod);
    const bruta = pk ? pk.qtd : 0;
    if(bruta < 0) negativos++;
    const qtdUn = Math.max(0, bruta);                         // QTD DISP negativa conta como 0
    const fator = n.qtunitcx > 0 ? n.qtunitcx : null;         // unidades por caixa (QTUNITCX)
    if(pk && !fator) pkSemQtunitcx += pk.n;
    const caixas = fator ? qtdUn / fator : null;
    // capacidade: Cap Pick (coluna N) do(s) endereço(s) PK da 1707; se faltar, usa a CAPACIDADE da 8022 Nova
    const cap = (pk && pk.cap > 0) ? pk.cap : (n.capacidade > 0 ? n.capacidade : null);
    const pct = (caixas != null && cap != null) ? Math.round(caixas / cap * 10000) / 100 : null;
    const ruaNum = (pk && pk.rua) ? pk.rua : (() => { const d = String(n.rua==null ? "" : n.rua).replace(/\D/g,""); return d ? parseInt(d,10) : null; })();
    rows.push({
      codprod:n.codprod, descricao:n.descricao, rua:n.rua, ruaNum, predio:n.predio, apto:n.apto,
      fator, qtd:qtdUn, caixas, capacidade:cap, pct,
      faixa: abastFaixaDe(pct), ruaRange: abastRuaRange(ruaNum), zerado: qtdUn <= 0,
      temAE: aeSet.has(n.codprod), temPK: !!pk, enderecosPK: pk ? pk.n : 0, codEnd: pk ? pk.end : null
    });
  });

  return { erro:null, rows, linhaInicial, negativos, pkSemCadastro, pkSemQtunitcx,
           totalProdutos: rows.length, tiposIgnorados: Array.from(tiposVistos.entries()).filter(([t])=>t!=="PK" && t!=="AE") };
}

// ---------------------------------------------------------------------------
// Cálculo: aplica toggles e limite sobre a base
// ---------------------------------------------------------------------------
function abastCompute(base, opts){
  const lim = Number(opts.limite);
  const ehNaoRevenda = r => r.ruaNum != null && r.ruaNum > ABAST_RUA_MAX_REVENDA;
  // saldo baixo = produto SÓ com picking (sem AE), com endereço PK ocupado e até `lim` caixas
  const ehSaldoBaixo = r => !r.temAE && r.temPK && r.caixas != null && r.caixas <= lim;

  // ---- nível de abastecimento (afetado pelos 3 toggles) ----
  const fora = { naoRevenda:0, semAE:0, saldoBaixo:0 };
  const rows = [];
  base.rows.forEach(r=>{
    if(!opts.naoRevenda && ehNaoRevenda(r)){ fora.naoRevenda++; return; }
    if(opts.excluirSemAE && !r.temAE){ fora.semAE++; return; }
    if(!opts.saldoBaixo && ehSaldoBaixo(r)){ fora.saldoBaixo++; return; }
    rows.push(r);
  });
  rows.sort((a,b)=> (a.pct==null?1e9:a.pct) - (b.pct==null?1e9:b.pct));

  const calculados = rows.filter(r=>r.pct != null);
  const somaCx  = calculados.reduce((s,r)=>s+r.caixas,0);
  const somaCap = calculados.reduce((s,r)=>s+r.capacidade,0);

  const porFaixa = {};
  [...ABAST_FAIXAS, ABAST_FAIXA_ND].forEach(f=>{ porFaixa[f.id] = 0; });
  rows.forEach(r=>{ porFaixa[r.faixa.id]++; });

  const agrega = (lista) => {
    const calc = lista.filter(r=>r.pct != null);
    const cx = calc.reduce((s,r)=>s+r.caixas,0), cp = calc.reduce((s,r)=>s+r.capacidade,0);
    const faixas = {};
    ABAST_FAIXAS.forEach(f=>{ faixas[f.id] = 0; });
    calc.forEach(r=>{ faixas[r.faixa.id]++; });
    return {
      itens: lista.length, calculados: calc.length, cx, cp,
      media: calc.length ? calc.reduce((s,r)=>s+r.pct,0)/calc.length : null,
      ponderado: cp > 0 ? cx / cp * 100 : null,
      abaixo50: calc.filter(r=>r.pct < 50).length,
      zerados: lista.filter(r=>r.zerado).length,
      faixas
    };
  };

  const porRuaRange = ABAST_RUAS.map(rg => ({ rg, ...agrega(rows.filter(r=>r.ruaRange.id === rg.id)) }));
  const ruasMap = new Map();
  rows.forEach(r=>{ const k = r.ruaNum!=null ? r.ruaNum : -1; if(!ruasMap.has(k)) ruasMap.set(k, []); ruasMap.get(k).push(r); });
  const porRua = Array.from(ruasMap.entries()).map(([k,lista]) => ({
    ruaNum: k, ruaLabel: k>=0 ? String(k) : "—", ...agrega(lista)
  })).sort((a,b)=> (a.ponderado==null?1e9:a.ponderado) - (b.ponderado==null?1e9:b.ponderado));

  // ---- saldo baixo (só a regra das ruas acima da 47 vale aqui; AE e saldo baixo são o próprio critério) ----
  const pkBase = base.rows.filter(r=> r.temPK && r.fator && (opts.naoRevenda || !ehNaoRevenda(r)));
  const soma = lista => lista.reduce((s,r)=>s+r.enderecosPK, 0);
  const baixos = pkBase.filter(ehSaldoBaixo)
    .sort((a,b)=> (a.caixas - b.caixas) || String(a.codprod).localeCompare(String(b.codprod), undefined, {numeric:true}));
  const pkOcupados = soma(pkBase), pkSemAE = soma(pkBase.filter(r=>!r.temAE)), pkBaixos = soma(baixos);

  return {
    erro:null, rows, fora,
    total: rows.length, calculados: calculados.length,
    ponderadoGeral: somaCap > 0 ? somaCx / somaCap * 100 : null,
    zerados: rows.filter(r=>r.zerado).length,
    somaCx, somaCap,
    porFaixa, porRuaRange, porRua,
    ausentes: rows.filter(r=>!r.temPK).length,
    semCalculo: rows.filter(r=>r.pct == null),
    saldo: { baixos, pkOcupados, pkSemAE, pkBaixos, pct: pkOcupados ? pkBaixos / pkOcupados * 100 : null, limite: lim }
  };
}

function abastFN(n, d){ return (n==null||isNaN(n)) ? "—" : Number(n).toLocaleString("pt-BR",{maximumFractionDigits:d==null?1:d}); }
function abastFP(n){ return (n==null||isNaN(n)) ? "—" : Number(n).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1}) + "%"; }

function abastCorPct(p){ return p==null ? "#7a8798" : abastFaixaDe(p).cor; }

function abastLinhasFiltradas(){
  const c = AbastState.comp;
  if(!c || c.erro) return [];
  const q = normStr(AbastState.busca);
  return c.rows.filter(r=>{
    if(AbastState.faixa && r.faixa.id !== AbastState.faixa) return false;
    if(AbastState.rua && r.ruaRange.id !== AbastState.rua) return false;
    if(AbastState.ruaExata !== "" && String(r.ruaNum) !== String(AbastState.ruaExata)) return false;
    if(q && !(normStr(r.codprod).includes(q) || normStr(r.descricao).includes(q))) return false;
    return true;
  });
}

function abastBarraHtml(r){
  if(r.pct == null) return "—";
  return `<div class="abast-bar"><div class="abast-track"><div class="abast-fill" style="width:${Math.min(100, Math.max(0, r.pct))}%;background:${r.faixa.cor};"></div></div><span class="abast-bar-txt" style="color:${r.faixa.cor};">${abastFP(r.pct)}</span></div>`;
}

function renderAbastecimentoPicking(){
  const pane = $("#pane-abastecimento");
  if(!pane) return;
  const processed = window.APP_STATE && window.APP_STATE.processed;
  const raw = window.APP_STATE && window.APP_STATE.raw;
  if(!processed){
    pane.innerHTML = `<div class="panel" style="text-align:center;padding:60px 20px;color:#7a8798;">Nenhum arquivo carregado. Faça o upload do arquivo NUCLEO REPOSIÇÃO.</div>`;
    return;
  }

  const base = abastBase(processed, raw);
  AbastState.base = base;
  if(base.erro){
    AbastState.comp = null;
    pane.innerHTML = `<div class="panel-header"><h3 style="font-size:18px;">Abastecimento do Picking</h3></div><div class="cap-aviso" style="line-height:1.6;">⚠️ ${base.erro}</div>`;
    return;
  }

  const o = AbastState.opts;
  const c = abastCompute(base, o);
  AbastState.comp = c;
  const s = c.saldo;

  // ---- barra de controles (toggles + critério de saldo baixo) ----
  const tg = (chave, rotulo, valor, dica) => `
      <div class="filter-group" title="${escapeHtml(dica)}">
        <label>${rotulo}</label>
        <div class="toggle-group" style="width:fit-content;">
          <button class="${valor?"active":""}" onclick="abastSetToggle('${chave}',true)">Sim</button>
          <button class="${!valor?"active":""}" onclick="abastSetToggle('${chave}',false)">Não</button>
        </div>
      </div>`;
  const limiteCampo = AbastState.limiteDigitado != null ? AbastState.limiteDigitado : String(o.limite);

  const foraTxt = [
    c.fora.semAE      ? `${abastFN(c.fora.semAE,0)} sem AE` : "",
    c.fora.naoRevenda ? `${abastFN(c.fora.naoRevenda,0)} das ruas acima da 47` : "",
    c.fora.saldoBaixo ? `${abastFN(c.fora.saldoBaixo,0)} com saldo baixo` : ""
  ].filter(Boolean).join(" · ");
  const infoToolbar = `Considerando <b>${abastFN(c.total,0)}</b> de ${abastFN(base.totalProdutos,0)} produtos da 8022 Nova${foraTxt ? ` · fora do cálculo: ${foraTxt}` : ""}.
    Saldo baixo = produto só com picking (sem AE) com até ${abastFN(s.limite,1)} caixas.
    “Considerar Não Revenda?” (ruas acima da 47) vale para a aba toda; “Não considerar itens sem AE?” (Sim = tira os produtos sem AE) e “Considerar saldo baixo?” valem para o nível de abastecimento.`;

  // Mesmo padrão de cards das outras abas (.cards-grid / .card)
  const mkCard = (id, label, valor, sub, tom, tipo, extra) => {
    const ativo = ((tipo==="faixa" && AbastState.faixa===id) || (tipo==="rua" && AbastState.rua===id)) ? " abast-ativo" : "";
    const attr  = tipo==="faixa" ? ` data-faixa="${id}" onclick="abastSetFaixa('${id}')"`
                : tipo==="rua"   ? ` data-rua="${id}" onclick="abastSetRua('${id}')"` : "";
    return `<div class="card${tom ? " "+tom : ""}${tipo!=="info" ? " abast-click" : ""}${ativo}"${attr}>
      <div class="card-label">${label}</div>
      <div class="card-value${tom ? " "+tom : ""}">${valor}</div>
      <div class="card-sub">${sub}</div>${extra || ""}</div>`;
  };

  const pctDe = n => c.total ? abastFP(n / c.total * 100) + " dos itens" : "";
  const cardsFaixa = [...ABAST_FAIXAS, ...(c.porFaixa.nd ? [ABAST_FAIXA_ND] : [])].map(f =>
    mkCard(f.id, f.label, abastFN(c.porFaixa[f.id],0), pctDe(c.porFaixa[f.id]), f.tom, "faixa")).join("");

  const cardsResumo =
    mkCard("t", "Itens no picking", abastFN(c.total,0), `${abastFN(c.calculados,0)} com cálculo`, "", "info") +
    mkCard("g", "Abastecimento geral", abastFP(c.ponderadoGeral), "caixas ÷ capacidade", abastFaixaDe(c.ponderadoGeral).tom, "info") +
    mkCard("cx", "Caixas no picking", abastFN(c.somaCx,0), `de ${abastFN(c.somaCap,0)} cx de capacidade`, "", "info") +
    mkCard("z", "Itens zerados", abastFN(c.zerados,0), pctDe(c.zerados), c.zerados ? "neg" : "pos", "info");

  // intervalo de ruas menos abastecido (para destacar)
  const comDados = c.porRuaRange.filter(r=>r.calculados>0 && r.ponderado!=null);
  const pior = comDados.length ? comDados.reduce((a,b)=> b.ponderado < a.ponderado ? b : a) : null;

  const cardsRua = c.porRuaRange.filter(r=>r.itens>0).map(r=>{
    const badge = (pior && pior.rg.id===r.rg.id && comDados.length>1) ? ` <span class="abast-badge">menos abastecida</span>` : "";
    const mini = `<div class="abast-mini">
        <span><b>${abastFN(r.itens,0)}</b> itens</span>
        <span>média <b>${abastFP(r.media)}</b></span>
        <span><b>${abastFN(r.abaixo50,0)}</b> abaixo de 50%</span>
        <span><b>${abastFN(r.zerados,0)}</b> zerados</span></div>`;
    return mkCard(r.rg.id, r.rg.label, abastFP(r.ponderado), `da capacidade${badge}`, abastFaixaDe(r.ponderado).tom, "rua", mini);
  }).join("");

  const linhasRua = c.porRua.map(r=>`
    <tr class="clickable" onclick="abastSetRuaExata('${r.ruaNum}')" title="Filtrar a lista pela rua ${r.ruaLabel}">
      <td><b>${r.ruaLabel}</b></td>
      <td>${abastFN(r.itens,0)}</td>
      <td><span class="abast-pill" style="background:${abastCorPct(r.ponderado)}">${abastFP(r.ponderado)}</span></td>
      <td>${abastFP(r.media)}</td>
      <td>${abastFN(r.abaixo50,0)}</td>
      <td>${abastFN(r.zerados,0)}</td>
    </tr>`).join("");

  // ---- cards do saldo baixo ----
  const cardsSaldo =
    mkCard("pko", "PK ocupados", abastFN(s.pkOcupados,0), "endereços de picking com produto", "", "info") +
    mkCard("pka", "PK sem AE", abastFN(s.pkSemAE,0), "só existe o que está no picking", "", "info") +
    mkCard("pkb", "PK com saldo baixo", abastFN(s.pkBaixos,0), `sem AE e até ${abastFN(s.limite,1)} cx`, s.pkBaixos ? "neg" : "pos", "info") +
    mkCard("pkp", "% com saldo baixo", abastFP(s.pct), "dos PK ocupados", s.pkBaixos ? "warn" : "pos", "info");

  // ---- pontos para conferir (discreto) ----
  const nAcima = c.porFaixa.acima || 0;
  const semCalc = c.semCalculo.length;
  const pontos = [
    nAcima ? `<li><b>${abastFN(nAcima,0)} itens acima de 100%</b> (${abastFP(c.total ? nAcima/c.total*100 : 0)} do picking). Indica picking acima do limite ou capacidade desatualizada. A capacidade usada é o Cap Pick da 1707 (coluna N). <a href="#" onclick="abastSetFaixa('acima');return false;">ver itens</a></li>` : "",
    semCalc ? `<li><b>${abastFN(semCalc,0)} produtos sem cálculo</b> (sem QTUNITCX ou sem CAPACIDADE na 8022 Nova). Ex.: ${c.semCalculo.slice(0,5).map(r=>`<code>${escapeHtml(r.codprod)}</code>`).join(", ")}</li>` : "",
    c.ausentes ? `<li><b>${abastFN(c.ausentes,0)} produtos da 8022 Nova sem endereço PK com estoque na 1707</b> contam como 0%.</li>` : "",
    base.pkSemCadastro ? `<li><b>${abastFN(base.pkSemCadastro,0)} endereços PK da 1707 são de produtos que não estão na 8022 Nova</b> e ficaram de fora do cálculo.</li>` : "",
    base.pkSemQtunitcx ? `<li><b>${abastFN(base.pkSemQtunitcx,0)} endereços PK</b> de produtos sem QTUNITCX na 8022 Nova não puderam ser convertidos em caixas.</li>` : ""
  ].filter(Boolean);
  const blocoPontos = pontos.length ? `
    <details class="abast-pontos"><summary>⚠ ${pontos.length} ponto${pontos.length>1?"s":""} para conferir</summary><ul>${pontos.join("")}</ul></details>` : "";

  const notas = [
    `1707 sem cabeçalho, lida por posição: coluna G = Cod Prod, O = Tipo (AE ou AP/PK) e V = Qtd Disp. Código de produto 0 = endereço vazio e é ignorado.`,
    `Qtd Disp em unidades = soma dos endereços <b>PK</b> do produto. Caixas = Qtd Disp ÷ QTUNITCX (8022 Nova). Nível de abastecimento = caixas ÷ Cap Pick (coluna N da 1707; se faltar, CAPACIDADE da 8022 Nova).`,
    `O produto “tem AE” quando existe ao menos um endereço de Tipo AE com o código dele na 1707.`,
    `Não considerar itens sem AE? Sim = só entram produtos que têm AE (produtos só com AP saem do cálculo). Não = entram também os que não têm AE.`,
    `Considerar Não Revenda? Não = ignora as ruas acima da 47 em toda a aba, inclusive no saldo baixo.`,
    `Saldo baixo = produto sem AE, com endereço PK ocupado e caixas igual ou abaixo do limite. Considerar saldo baixo? Não = esses produtos saem do nível de abastecimento. Só faz diferença quando “Não considerar itens sem AE?” está em Não, porque saldo baixo é sempre de produto sem AE.`,
    `PK ocupado = endereço de Tipo PK com produto, de produto cadastrado na 8022 Nova com QTUNITCX.`,
    `Nas ruas e intervalos de ruas o percentual é ponderado: soma das caixas ÷ soma das capacidades. A rua vem da coluna B da 1707.`,
    base.negativos ? `${abastFN(base.negativos,0)} produto(s) com Qtd Disp negativa na 1707 foram tratados como 0.` : "",
    base.tiposIgnorados.length ? `Linhas com Tipo diferente de AE e PK foram ignoradas: ${base.tiposIgnorados.map(([t,n])=>`${escapeHtml(t||"(vazio)")} (${n})`).join(", ")}.` : ""
  ].filter(Boolean).map(t=>`<li>${t}</li>`).join("");

  pane.innerHTML = `
    <div class="panel-header">
      <h3 style="font-size:18px;">Abastecimento do Picking</h3>
      <div class="panel-actions"><button class="btn btn-outline btn-sm" onclick="abastExportar()">⤓ Exportar Excel</button></div>
    </div>

    <div class="toolbar" id="abast-toolbar" style="margin-bottom:8px;">
      <div class="filter-group" title="Produtos só com picking (sem AE) com esta quantidade de caixas ou menos são saldo baixo">
        <label>Saldo baixo: até (caixas)</label>
        <div style="display:flex;gap:6px;align-items:center;">
          <input type="number" id="abast-limite" min="0" step="any" value="${escapeHtml(limiteCampo)}" style="width:90px;"
                 oninput="AbastState.limiteDigitado=this.value" onkeydown="if(event.key==='Enter'){abastBuscar();}">
          <button class="btn btn-primary btn-sm" onclick="abastBuscar()">Buscar</button>
        </div>
      </div>
      ${tg("saldoBaixo","Considerar saldo baixo?", o.saldoBaixo, "Sim = produtos com saldo baixo entram no nível de abastecimento. Não = ficam fora de tudo.")}
      ${tg("naoRevenda","Considerar Não Revenda?", o.naoRevenda, "Sim = inclui as ruas acima da 47. Não = essas ruas ficam fora do cálculo.")}
      ${tg("excluirSemAE","Não considerar itens sem AE?", o.excluirSemAE, "Sim = tira do cálculo os produtos que só têm picking (AP) e não têm AE. Não = inclui esses produtos.")}
    </div>
    <div class="panel-note" style="margin:0 2px 16px;line-height:1.5;">${infoToolbar}</div>

    <div class="cards-grid">${cardsResumo}</div>

    <div class="panel">
      <div class="panel-header"><h3>Itens por faixa de abastecimento</h3><span class="panel-note">clique em um card para filtrar a lista</span></div>
      <div class="cards-grid" style="margin-bottom:0;">${cardsFaixa}</div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>Por intervalo de ruas</h3><span class="panel-note">clique em um card para filtrar a lista</span></div>
      <div class="cards-grid" style="margin-bottom:0;">${cardsRua}</div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h3>Abastecimento por Rua — % da capacidade (Cap Pick, 1707)</h3>
        <span class="panel-note">a parte escura mostra o % abastecido, preenchendo de baixo para cima · clique na barra para filtrar a lista</span>
      </div>
      <div class="chart-wrap tall"><canvas id="abast-chart-rua-pct"></canvas></div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-header"><h3>Faixas de abastecimento por intervalo de ruas</h3></div>
        <div class="chart-wrap"><canvas id="abast-chart-ruas"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-header"><h3>Ruas — da menos para a mais abastecida</h3></div>
        <div class="table-wrap" style="max-height:280px;overflow-y:auto;">
          <table class="data-table">
            <thead><tr><th>Rua</th><th>Itens</th><th>Abast.</th><th>Média</th><th>&lt; 50%</th><th>Zerados</th></tr></thead>
            <tbody>${linhasRua}</tbody>
          </table>
        </div>
      </div>
    </div>

    ${blocoPontos}

    <div class="panel" id="abast-lista">
      <div class="panel-header"><h3>Lista de produtos</h3></div>
      <div class="abast-filtros">
        <input type="search" id="abast-busca" placeholder="Buscar código ou descrição…" value="${escapeHtml(AbastState.busca)}" oninput="abastSetBusca(this.value)">
        <span id="abast-filtros-ativos"></span>
        <button class="cap-btn-clear" onclick="abastLimpar()">Limpar filtros</button>
      </div>
      <div id="abast-tabela"></div>
    </div>

    <div class="panel" id="abast-saldo">
      <div class="panel-header">
        <h3>Saldo baixo no picking</h3>
        <div class="panel-actions">
          <span class="panel-note">produtos só com picking (sem AE) com até ${abastFN(s.limite,1)} caixas</span>
          <button class="btn btn-outline btn-sm" onclick="abastExportarSaldo()">⤓ Exportar Excel</button>
        </div>
      </div>
      <div class="cards-grid">${cardsSaldo}</div>
      <div id="abast-saldo-lista"></div>
    </div>

    <details class="abast-notas"><summary>Como o cálculo é feito</summary><ul>${notas}</ul></details>`;

  abastDesenharGrafico(c);
  abastDesenharGraficoRuas(c);
  abastAtualizarLista();
  abastDesenharSaldo();
}

// Faixas de abastecimento por intervalo de ruas (barras empilhadas)
function abastDesenharGrafico(c){
  const grupos = c.porRuaRange.filter(r=>r.itens>0);
  Charts.make("abast-chart-ruas", {
    type: "bar",
    data: {
      labels: grupos.map(g=>g.rg.label.replace("Ruas ","")),
      datasets: ABAST_FAIXAS.map(f=>({
        label: f.label, backgroundColor: f.corGraf,
        data: grupos.map(g=>g.faixas[f.id])
      }))
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: {
        legend: { position:"bottom", labels:{ boxWidth:12, font:{size:11} } },
        datalabels: { display: ctx => ctx.dataset.data[ctx.dataIndex] > 0, color:"#fff", anchor:"center", align:"center", font:{size:10, weight:"700"} }
      },
      scales: { x:{ stacked:true }, y:{ stacked:true, beginAtZero:true, ticks:{ precision:0 } } }
    }
  });
}

// Rua a rua: % da capacidade abastecida, barra preenchendo de baixo para cima
// (mesmo estilo do "Cobertura por Rua" da Capacidade CD: azul escuro = preenchido, azul claro = vazio)
function abastDesenharGraficoRuas(c){
  const ruas = c.porRua.filter(r=>r.ruaNum >= 0).sort((a,b)=>a.ruaNum-b.ruaNum);
  const real  = ruas.map(r => r.ponderado == null ? 0 : r.ponderado);
  const fill  = real.map(p => Math.min(100, Math.max(0, Math.round(p*10)/10)));
  const vazio = fill.map(p => Math.round((100 - p)*10)/10);
  const COR_FILL = "#2563CC", COR_VAZIO = "#A8C8FF";
  Charts.make("abast-chart-rua-pct", {
    type: "bar",
    data: {
      labels: ruas.map(r=>String(r.ruaNum)),
      datasets: [
        { label:"Abastecido (%)", data:fill, backgroundColor:COR_FILL, borderWidth:0, stack:"rua",
          datalabels:{ display: ctx => fill[ctx.dataIndex] >= 12, color:"#fff", anchor:"center", align:"center", rotation:-90,
                       font:{ weight:"bold", size:9 }, formatter:(v,ctx)=> Math.round(real[ctx.dataIndex]) + "%" } },
        { label:"Falta para a capacidade (%)", data:vazio, backgroundColor:COR_VAZIO, borderWidth:0, stack:"rua",
          datalabels:{ display: ctx => fill[ctx.dataIndex] < 12, color:"#123a6b", anchor:"center", align:"center", rotation:-90,
                       font:{ weight:"bold", size:9 }, formatter:(v,ctx)=> Math.round(real[ctx.dataIndex]) + "%" } }
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      onClick: (evt, els) => {
        if(els && els.length){
          abastSetRuaExata(ruas[els[0].index].ruaNum);
          const alvo = $("#abast-lista"); if(alvo && alvo.scrollIntoView) alvo.scrollIntoView({ behavior:"smooth", block:"start" });
        }
      },
      plugins: {
        legend: { display:false },
        tooltip: {
          filter: item => item.datasetIndex === 0,
          callbacks: {
            title: items => "Rua " + ruas[items[0].dataIndex].ruaNum,
            label: item => {
              const r = ruas[item.dataIndex];
              return [
                "Abastecido: " + abastFP(real[item.dataIndex]) + " da capacidade",
                abastFN(r.cx,0) + " de " + abastFN(r.cp,0) + " cx",
                abastFN(r.itens,0) + " itens · " + abastFN(r.zerados,0) + " zerados"
              ];
            }
          }
        }
      },
      scales: {
        x: { stacked:true, ticks:{ color:"#7a8798", font:{size:9} }, grid:{ color:"#eef1f4" } },
        y: { stacked:true, beginAtZero:true, max:100, ticks:{ color:"#7a8798", font:{size:9}, callback:v=>v+"%" }, grid:{ color:"#eef1f4" } }
      }
    }
  });
}

function abastAtualizarLista(){
  const c = AbastState.comp;
  const wrap = $("#abast-tabela");
  if(!c || !wrap) return;
  const lista = abastLinhasFiltradas();
  const LIMITE = AbastState.mostrarTodos ? Infinity : 1000;
  const corpo = lista.slice(0, LIMITE).map(r=>`
    <tr>
      <td>${escapeHtml(r.codprod)}</td>
      <td>${escapeHtml(r.descricao)}</td>
      <td>${escapeHtml(r.rua==null?"":r.rua)}</td>
      <td>${escapeHtml(r.predio==null?"":r.predio)}</td>
      <td>${escapeHtml(r.apto==null?"":r.apto)}</td>
      <td>${r.temAE ? "Sim" : "Não"}</td>
      <td>${r.fator==null ? "—" : abastFN(r.fator,0)}</td>
      <td>${abastFN(r.capacidade,0)}</td>
      <td>${abastFN(r.caixas,1)}</td>
      <td>${abastFN(r.qtd,0)}</td>
      <td>${abastBarraHtml(r)}</td>
    </tr>`).join("");

  const cortado = lista.length > LIMITE;
  wrap.innerHTML = `
    <div class="table-wrap" style="max-height:540px;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>Cód.</th><th>Descrição</th><th>Rua</th><th>Prédio</th><th>Apto</th><th>Tem AE</th><th>Un/Cx</th><th>Capacidade (cx)</th><th>Qtd disp (cx)</th><th>Qtd disp (un)</th><th>% Abastecido</th></tr></thead>
        <tbody>${corpo || `<tr><td colspan="11" style="text-align:center;color:#7a8798;padding:24px;">Nenhum item com os filtros atuais.</td></tr>`}</tbody>
      </table>
    </div>
    <div class="panel-note" style="margin-top:8px;">${abastFN(lista.length,0)} item(ns)${cortado ? ` — mostrando os ${abastFN(LIMITE,0)} menos abastecidos. <a href="#" onclick="abastMostrarTodos();return false;">mostrar todos</a> (ou use Exportar Excel)` : ""}</div>`;

  // chips dos filtros ativos + destaque dos cards
  const chips = [];
  if(AbastState.faixa){ const f = [...ABAST_FAIXAS, ABAST_FAIXA_ND].find(x=>x.id===AbastState.faixa); if(f) chips.push(f.label); }
  if(AbastState.rua){ const r = ABAST_RUAS.find(x=>x.id===AbastState.rua); if(r) chips.push(r.label); }
  if(AbastState.ruaExata !== "") chips.push("Rua " + (AbastState.ruaExata==="-1" ? "—" : AbastState.ruaExata));
  const chipEl = $("#abast-filtros-ativos");
  if(chipEl) chipEl.innerHTML = chips.map(t=>`<span class="abast-chip">${escapeHtml(t)}</span>`).join("");
  $all(".card[data-faixa]").forEach(el=> el.classList.toggle("abast-ativo", el.dataset.faixa===AbastState.faixa));
  $all(".card[data-rua]").forEach(el=> el.classList.toggle("abast-ativo", el.dataset.rua===AbastState.rua));
}

// Lista exclusiva de saldo baixo: produtos só com picking, com caixas <= limite, do menor para o maior
function abastDesenharSaldo(){
  const c = AbastState.comp;
  const wrap = $("#abast-saldo-lista");
  if(!c || !wrap) return;
  const lista = c.saldo.baixos;
  const LIMITE = AbastState.mostrarTodosSaldo ? Infinity : 1000;
  const corpo = lista.slice(0, LIMITE).map(r=>`
    <tr>
      <td>${escapeHtml(r.codprod)}</td>
      <td>${escapeHtml(r.descricao)}</td>
      <td>${escapeHtml(r.rua==null?"":r.rua)}</td>
      <td>${escapeHtml(r.predio==null?"":r.predio)}</td>
      <td>${escapeHtml(r.apto==null?"":r.apto)}</td>
      <td>${r.fator==null ? "—" : abastFN(r.fator,0)}</td>
      <td>${abastFN(r.capacidade,0)}</td>
      <td><b>${abastFN(r.caixas,1)}</b></td>
      <td>${abastFN(r.qtd,0)}</td>
      <td>${abastBarraHtml(r)}</td>
    </tr>`).join("");
  const cortado = lista.length > LIMITE;
  wrap.innerHTML = `
    <div class="table-wrap" style="max-height:480px;overflow:auto;">
      <table class="data-table">
        <thead><tr><th>Cód.</th><th>Descrição</th><th>Rua</th><th>Prédio</th><th>Apto</th><th>Un/Cx</th><th>Capacidade (cx)</th><th>Qtd disp (cx)</th><th>Qtd disp (un)</th><th>% Abastecido</th></tr></thead>
        <tbody>${corpo || `<tr><td colspan="10" style="text-align:center;color:#7a8798;padding:24px;">Nenhum produto sem AE com até ${abastFN(c.saldo.limite,1)} caixas.</td></tr>`}</tbody>
      </table>
    </div>
    <div class="panel-note" style="margin-top:8px;">${abastFN(lista.length,0)} produto(s)${cortado ? ` — mostrando os ${abastFN(LIMITE,0)} com menos caixas. <a href="#" onclick="abastMostrarTodosSaldo();return false;">mostrar todos</a> (ou use Exportar Excel)` : ""}</div>`;
}

function abastSetToggle(chave, valor){
  AbastState.opts[chave] = !!valor;
  AbastState.mostrarTodos = false; AbastState.mostrarTodosSaldo = false;
  renderAbastecimentoPicking();
}

// Aplica o limite digitado (campo "Saldo baixo: até (caixas)") e recalcula a aba
function abastBuscar(){
  const campo = $("#abast-limite");
  const txt = campo ? String(campo.value).replace(",", ".").trim() : String(AbastState.opts.limite);
  const n = Number(txt);
  if(txt === "" || !isFinite(n) || n < 0){
    toast("Digite uma quantidade de caixas válida (0 ou mais).", "error");
    return;
  }
  AbastState.opts.limite = n;
  AbastState.limiteDigitado = null;
  AbastState.mostrarTodos = false; AbastState.mostrarTodosSaldo = false;
  renderAbastecimentoPicking();
}

function abastMostrarTodos(){ AbastState.mostrarTodos = true; abastAtualizarLista(); }
function abastMostrarTodosSaldo(){ AbastState.mostrarTodosSaldo = true; abastDesenharSaldo(); }
function abastSetFaixa(id){ AbastState.faixa = AbastState.faixa===id ? "" : id; abastAtualizarLista(); }
function abastSetRua(id){ AbastState.rua = AbastState.rua===id ? "" : id; AbastState.ruaExata = ""; abastAtualizarLista(); }
function abastSetRuaExata(n){ AbastState.ruaExata = AbastState.ruaExata===String(n) ? "" : String(n); AbastState.rua = ""; abastAtualizarLista(); }
function abastSetBusca(v){ AbastState.busca = v || ""; abastAtualizarLista(); }
function abastLimpar(){
  AbastState.faixa = ""; AbastState.rua = ""; AbastState.ruaExata = ""; AbastState.busca = ""; AbastState.mostrarTodos = false;
  const b = $("#abast-busca"); if(b) b.value = "";
  abastAtualizarLista();
}

function abastExportar(){
  const lista = abastLinhasFiltradas();
  if(!lista.length){ toast("Nada para exportar com os filtros atuais.", "error"); return; }
  const dados = lista.map(r=>({
    "CODPROD": r.codprod, "DESCRIÇÃO": r.descricao, "RUA": r.rua, "PRÉDIO": r.predio, "APTO": r.apto,
    "TEM AE": r.temAE ? "SIM" : "NÃO", "UN POR CAIXA (QTUNITCX)": r.fator,
    "CAPACIDADE (CX)": r.capacidade,
    "QTD DISP (CX)": r.caixas==null ? null : Math.round(r.caixas*100)/100,
    "QTD DISP (UN)": r.qtd,
    "% ABASTECIDO": r.pct, "FAIXA": r.faixa.label
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dados), "Nivel Abastecimento");
  XLSX.writeFile(wb, "Nivel_Abastecimento.xlsx");
}

function abastExportarSaldo(){
  const c = AbastState.comp;
  const lista = c ? c.saldo.baixos : [];
  if(!lista.length){ toast("Nenhum produto com saldo baixo para exportar.", "error"); return; }
  const dados = lista.map(r=>({
    "CODPROD": r.codprod, "DESCRIÇÃO": r.descricao, "RUA": r.rua, "PRÉDIO": r.predio, "APTO": r.apto,
    "UN POR CAIXA (QTUNITCX)": r.fator, "CAPACIDADE (CX)": r.capacidade,
    "QTD DISP (CX)": r.caixas==null ? null : Math.round(r.caixas*100)/100,
    "QTD DISP (UN)": r.qtd, "% ABASTECIDO": r.pct
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dados), "Saldo Baixo");
  XLSX.writeFile(wb, "Saldo_Baixo_Picking.xlsx");
}
