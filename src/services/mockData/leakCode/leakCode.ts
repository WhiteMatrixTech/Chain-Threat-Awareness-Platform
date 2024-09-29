/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: didadida262
 * @Date: 2024-09-27 21:16:38
 * @LastEditors: didadida262
 * @LastEditTime: 2024-09-29 14:23:15
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
    title: "GetQueryResult等范围查询函数可能会导致事务中出现幻读。",
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
    title: "交易在确认后写入分类账，如果在写入函数之后立即使用读取函数，则可能无法获得预期结果，因为它可能尚未写入账本。",
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
    title: "内存地址的环境不同，存储的值也不相同，使用内存地址会导致非确定性行为。",
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
