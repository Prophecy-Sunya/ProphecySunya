# Cairo v2.11.4 Map Trait Implementation Fix

This document explains how to properly implement Map storage access in Cairo v2.11.4, which is required to fix the empty artifact arrays issue in the ProphecySunya project.

## Problem

In Cairo v2.11.4, the storage access patterns have changed significantly from earlier versions. The error messages we encountered were:

```
Method `read` could not be called on type `core::starknet::storage::storage_base::StorageBase::<core::starknet::storage::map::Map::<core::felt252, prophecy_sunya::types::types::BridgedPrediction>>`.
```

This indicates that we're missing the proper trait implementations for Map read/write operations.

## Solution

To fix this issue, we need to:

1. Import the correct storage access traits
2. Use the proper Map access patterns
3. Implement the `StorageAccess` trait for custom structs

## Correct Imports

```cairo
use starknet::ContractAddress;
use starknet::storage_access::StorageAccess;
use starknet::storage_access::StorageBaseAddress;
use starknet::storage_access::StorageAddress;
use starknet::storage_access::store;
use starknet::storage_access::load;
use starknet::SyscallResult;
use starknet::storage::StorageMapMemberAccessTrait;
use starknet::storage::StorageMapMemberAddressTrait;
use starknet::storage::StorageBaseAddress;
use starknet::storage::StorageAddress;
use starknet::storage::StorageAccess;
use starknet::storage::StorageAccessTrait;
use starknet::storage::Map;
```

## Implementation for Custom Structs

For each custom struct that needs to be stored in a Map, we need to implement the `StorageAccess` trait:

```cairo
impl StorageAccessBridgedPrediction of StorageAccess<BridgedPrediction> {
    fn store(address_domain: u32, base: StorageBaseAddress, value: BridgedPrediction) -> SyscallResult<()> {
        store(address_domain, base, value.id)?;
        store(address_domain, base + 1, value.source_chain)?;
        store(address_domain, base + 2, value.source_id)?;
        store(address_domain, base + 3, value.starknet_id)?;
        store(address_domain, base + 4, value.status)?;
        SyscallResult::Ok(())
    }

    fn load(address_domain: u32, base: StorageBaseAddress) -> SyscallResult<BridgedPrediction> {
        let id = load(address_domain, base)?;
        let source_chain = load(address_domain, base + 1)?;
        let source_id = load(address_domain, base + 2)?;
        let starknet_id = load(address_domain, base + 3)?;
        let status = load(address_domain, base + 4)?;
        
        SyscallResult::Ok(
            BridgedPrediction {
                id,
                source_chain,
                source_id,
                starknet_id,
                status,
            }
        )
    }
}
```

## Correct Map Usage

With the proper trait implementation, Map operations will work correctly:

```cairo
// Reading from a Map
let value = self.my_map.read(key);

// Writing to a Map
self.my_map.write(key, value);
```

This fix has been applied to all contracts in the ProphecySunya project to ensure proper compilation and artifact generation.
