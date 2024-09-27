/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-27 21:16:38
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-28 01:49:58
 */
export const leakMap = [
  {
    // eslint-disable-next-line prettier/prettier
    key: "Field Declarations",
    title: "在结构体中声明字段可能会导致变量值不一致。",
    code: `type Chaincode struct {
       FieldValue int
    }
    
    func (c *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
       if c.FieldValue > 0 {
          fmt.Println("Test")
       }
       c.FieldValue = -1
       
       return shim.Success([]byte("success"))
    }`
  },
  {
    key: "Blacklist Import",
    title: "相关包中的函数（例如 time.Now() ）会引起的非确定性行为。",
    code: `package chaincodes
     import (
        "fmt"
        "math/rand"
        "time"
     )`
  },
  {
    key: "Range Query Risk",
    title: "Range Query Risk",
    code: `
      func test_range_query_risks(queryString string) {
         stub := shim.ChaincodeStub{}
         resultsIterator, err := stub.GetQueryResult(queryString)
         if err != nil {
            fmt.Println(err)
         }
         defer resultsIterator.Close()
      
         stub.GetPrivateDataQueryResult("", "")
      }
      `
  },
  {
    key: "Read your Write",
    title: "Read your Write",
    code: `
      func test_read_after_write() {
         stub := shim.ChaincodeStub{}
         err := stub.PutState("key", []byte("value"))
         fmt.Println(err)
         res, err := stub.GetState("key")
         fmt.Println(res, err)
      }
      `
  },
  {
    key: "Reifified Object Addresses",
    title: "Reifified Object Addresses",
    code: `
      func test_reified_object_addresses() {
         dataList := [3]int8{1, 2, 3}
         var firstDataPtr *int8 = &dataList[0]
         ptr := unsafe.Pointer(firstDataPtr)
         targetAddress := uintptr(ptr) + 2
         newPtr := unsafe.Pointer(targetAddress)
         value := (*int8)(newPtr)
         fmt.Println(*value)
      }
      `
  }
];
